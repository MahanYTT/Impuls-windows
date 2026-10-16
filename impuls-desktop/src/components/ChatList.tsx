import React, { useState } from 'react';
import { Chat, TabType } from '../types';
import { Search, Plus, ShieldCheck, Radio, Users, CheckCheck, Check, MoreVertical, Filter } from 'lucide-react';

interface ChatListProps {
  chats: Chat[];
  activeChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onNewChat: (title: string, username: string) => void;
  onOpenNewGroup: () => void;
  currentTab: TabType;
  onTabChange?: (tab: TabType) => void;
}

export const ChatList: React.FC<ChatListProps> = ({
  chats,
  activeChatId,
  onSelectChat,
  onNewChat,
  onOpenNewGroup,
  currentTab,
  onTabChange,
}) => {
  const [search, setSearch] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'unread' | 'groups' | 'channels'>('all');

  const filteredChats = chats.filter(chat => {
    if (filterMode === 'unread' && (!chat.unreadCount || chat.unreadCount === 0)) return false;
    if (filterMode === 'groups' && chat.type !== 'group') return false;
    if (filterMode === 'channels' && chat.type !== 'channel') return false;

    if (currentTab === 'groups' && chat.type !== 'group') return false;
    if (currentTab === 'channels' && chat.type !== 'channel') return false;
    if (currentTab === 'dm' && (chat.type === 'channel' || chat.type === 'group')) return false;

    if (!search.trim()) return true;
    return (
      chat.title.toLowerCase().includes(search.toLowerCase()) ||
      (chat.username && chat.username.toLowerCase().includes(search.toLowerCase())) ||
      (chat.lastMessage && chat.lastMessage.toLowerCase().includes(search.toLowerCase()))
    );
  });

  const handleCreateNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onNewChat(newTitle.trim(), newUsername.trim() || newTitle.trim().toLowerCase());
    setNewTitle('');
    setNewUsername('');
    setShowNewModal(false);
  };

  return (
    <div className="sidebar-panel">
      {/* WhatsApp Sidebar Header (Height 59px, #202c33) */}
      <div style={{
        height: '59px',
        padding: '0 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'var(--bg-chat-header)',
        borderBottom: '1px solid var(--border-subtle)',
        flexShrink: 0,
      }}>
        <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
          Chats
        </h2>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* New Group Button */}
          <button
            onClick={onOpenNewGroup}
            className="wa-dock-icon-btn"
            title="New Group (WhatsApp Style)"
            style={{ width: '36px', height: '36px' }}
          >
            <Users size={19} />
          </button>

          {/* New Conversation Button */}
          <button
            onClick={() => setShowNewModal(true)}
            className="wa-dock-icon-btn"
            title="New Direct Message"
            style={{ width: '36px', height: '36px' }}
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      {/* WhatsApp Search Bar Section */}
      <div style={{
        padding: '8px 12px 6px 12px',
        backgroundColor: 'var(--bg-sidebar)',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        flexShrink: 0,
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'var(--bg-input)',
          borderRadius: '8px',
          padding: '0 12px',
          height: '36px',
        }}>
          <Search size={15} color="var(--text-muted)" style={{ flexShrink: 0, marginRight: '10px' }} />
          <input
            type="text"
            placeholder="Search or start new chat"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              backgroundColor: 'transparent',
              fontSize: '13.5px',
              color: 'var(--text-primary)',
            }}
          />
        </div>

        {/* Filter Chips Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
          <button
            onClick={() => setFilterMode('all')}
            style={{
              padding: '4px 12px',
              borderRadius: '16px',
              fontSize: '12px',
              fontWeight: 500,
              backgroundColor: filterMode === 'all' ? 'var(--accent-whatsapp)' : 'var(--bg-card)',
              color: filterMode === 'all' ? '#ffffff' : 'var(--text-secondary)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            All
          </button>
          <button
            onClick={() => setFilterMode('unread')}
            style={{
              padding: '4px 12px',
              borderRadius: '16px',
              fontSize: '12px',
              fontWeight: 500,
              backgroundColor: filterMode === 'unread' ? 'var(--accent-whatsapp)' : 'var(--bg-card)',
              color: filterMode === 'unread' ? '#ffffff' : 'var(--text-secondary)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Unread
          </button>
          <button
            onClick={() => setFilterMode('groups')}
            style={{
              padding: '4px 12px',
              borderRadius: '16px',
              fontSize: '12px',
              fontWeight: 500,
              backgroundColor: filterMode === 'groups' ? 'var(--accent-whatsapp)' : 'var(--bg-card)',
              color: filterMode === 'groups' ? '#ffffff' : 'var(--text-secondary)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Groups
          </button>
          <button
            onClick={() => setFilterMode('channels')}
            style={{
              padding: '4px 12px',
              borderRadius: '16px',
              fontSize: '12px',
              fontWeight: 500,
              backgroundColor: filterMode === 'channels' ? 'var(--accent-whatsapp)' : 'var(--bg-card)',
              color: filterMode === 'channels' ? '#ffffff' : 'var(--text-secondary)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Channels
          </button>
        </div>
      </div>

      {/* WhatsApp Contact / Chat Item List */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {filteredChats.length === 0 ? (
          <div style={{ padding: '40px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
            <p style={{ marginBottom: '10px' }}>No chats found.</p>
            <button
              onClick={() => setShowNewModal(true)}
              style={{
                color: 'var(--accent-whatsapp)',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              Start a new chat
            </button>
          </div>
        ) : (
          filteredChats.map(chat => {
            const isActive = chat.id === activeChatId;
            const isGroup = chat.type === 'group';

            return (
              <div
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '0 16px',
                  height: '72px',
                  cursor: 'pointer',
                  backgroundColor: isActive ? 'var(--bg-input)' : 'transparent',
                  transition: 'background-color 0.12s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = 'var(--bg-card)';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                {/* 49px WhatsApp Avatar */}
                <div style={{
                  width: '49px',
                  height: '49px',
                  borderRadius: '50%',
                  backgroundColor: chat.avatarColor || (chat.type === 'system' ? '#2c394b' : (chat.type === 'channel' ? '#1c2430' : 'var(--accent-whatsapp-dark)')),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: chat.avatar ? '22px' : '17px',
                  flexShrink: 0,
                  position: 'relative',
                }}>
                  {chat.avatar ? (
                    chat.avatar
                  ) : chat.type === 'system' ? (
                    <ShieldCheck size={22} color="#a0b4cc" />
                  ) : chat.type === 'channel' ? (
                    <Radio size={20} color="#8fa8c8" />
                  ) : isGroup ? (
                    <Users size={20} color="#fff" />
                  ) : (
                    chat.title.charAt(0).toUpperCase()
                  )}

                  {chat.isOnline && !isGroup && (
                    <span style={{
                      position: 'absolute',
                      bottom: '2px',
                      right: '2px',
                      width: '11px',
                      height: '11px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--status-online)',
                      border: '2px solid var(--bg-sidebar)',
                    }} />
                  )}
                </div>

                {/* Details Right Block with WhatsApp Hairline Divider */}
                <div style={{
                  flex: 1,
                  minWidth: 0,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  borderBottom: '1px solid var(--border-subtle)',
                  paddingRight: '4px',
                }}>
                  {/* Top Line: Name and Time */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                    <span style={{
                      fontSize: '16px',
                      fontWeight: 500,
                      color: 'var(--text-primary)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {chat.title}
                    </span>
                    {chat.lastMessageTime && (
                      <span style={{
                        fontSize: '12px',
                        color: chat.unreadCount && chat.unreadCount > 0 ? 'var(--accent-whatsapp-green)' : 'var(--text-muted)',
                        fontWeight: chat.unreadCount && chat.unreadCount > 0 ? 600 : 400,
                      }}>
                        {new Date(chat.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>

                  {/* Bottom Line: Last Message Preview & Unread Pill */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{
                      fontSize: '13.5px',
                      color: 'var(--text-secondary)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      maxWidth: '220px',
                    }}>
                      {/* Read status icon on outgoing preview */}
                      <CheckCheck size={15} color="var(--wa-check-read)" style={{ flexShrink: 0 }} />
                      <span>{chat.lastMessage || 'Conversation initiated'}</span>
                    </div>

                    {chat.unreadCount && chat.unreadCount > 0 ? (
                      <span style={{
                        backgroundColor: 'var(--accent-whatsapp-green)',
                        color: '#111b21',
                        borderRadius: '12px',
                        minWidth: '20px',
                        height: '20px',
                        padding: '0 6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '11.5px',
                        fontWeight: 700,
                      }}>
                        {chat.unreadCount}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* New Conversation Modal */}
      {showNewModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div className="telegram-modal-pop" style={{
            width: '380px',
            backgroundColor: 'var(--bg-popover)',
            border: '1px solid var(--border-medium)',
            borderRadius: '12px',
            padding: '24px',
          }}>
            <h3 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px' }}>
              New Chat or Channel
            </h3>
            <form onSubmit={handleCreateNew} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Contact Name / Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mahan YTT"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    backgroundColor: 'var(--bg-input)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    fontSize: '13.5px',
                    color: 'var(--text-primary)',
                  }}
                  autoFocus
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Username (optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. mahan"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    backgroundColor: 'var(--bg-input)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    fontSize: '13.5px',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '6px',
                    color: 'var(--text-secondary)',
                    fontSize: '13px',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '8px 18px',
                    borderRadius: '6px',
                    backgroundColor: 'var(--accent-whatsapp)',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: '13px',
                  }}
                >
                  Start Chat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
