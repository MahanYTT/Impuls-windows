import React, { useState } from 'react';
import { Chat, TabType } from '../types';
import { Search, Plus, ShieldCheck, Radio, Users, MessageSquare } from 'lucide-react';

interface ChatListProps {
  chats: Chat[];
  activeChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onNewChat: (title: string, username: string) => void;
  onOpenNewGroup: () => void;
  currentTab: TabType;
}

export const ChatList: React.FC<ChatListProps> = ({
  chats,
  activeChatId,
  onSelectChat,
  onNewChat,
  onOpenNewGroup,
  currentTab,
}) => {
  const [search, setSearch] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newUsername, setNewUsername] = useState('');

  const filteredChats = chats.filter(chat => {
    if (currentTab === 'groups' && chat.type !== 'group') return false;
    if (currentTab === 'channels' && chat.type !== 'channel') return false;
    if (currentTab === 'dm' && chat.type === 'channel') return false;
    if (!search.trim()) return true;
    return (
      chat.title.toLowerCase().includes(search.toLowerCase()) ||
      (chat.username && chat.username.toLowerCase().includes(search.toLowerCase()))
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

  const sectionTitle = (() => {
    if (currentTab === 'groups') return 'WhatsApp Groups';
    if (currentTab === 'channels') return 'Encrypted Channels';
    return 'Conversations';
  })();

  return (
    <div className="sidebar-panel">
      {/* Top Header & Search */}
      <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
            {sectionTitle}
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {/* WhatsApp-Style New Group Button */}
            <button
              onClick={onOpenNewGroup}
              className="telegram-press"
              title="Create Easy WhatsApp-Style Group"
              style={{
                height: '28px',
                padding: '0 8px',
                borderRadius: '6px',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                color: 'var(--accent-telegram)',
                fontSize: '11.5px',
                fontWeight: 600,
              }}
            >
              <Users size={14} />
              <span>+ Group</span>
            </button>

            {/* New DM / Channel Button */}
            <button
              onClick={() => setShowNewModal(true)}
              className="telegram-press"
              title="Start new conversation or channel"
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '6px',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-secondary)',
              }}
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Search Input */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'var(--bg-input)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '8px',
          padding: '0 10px',
        }}>
          <Search size={14} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search chats, groups..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 8px',
              backgroundColor: 'transparent',
              fontSize: '13px',
              color: 'var(--text-primary)',
            }}
          />
        </div>
      </div>

      {/* Conversations List */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {filteredChats.length === 0 ? (
          <div style={{ padding: '36px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
            {currentTab === 'groups' ? (
              <div>
                <p style={{ marginBottom: '12px' }}>No groups created yet.</p>
                <button
                  onClick={onOpenNewGroup}
                  className="telegram-press"
                  style={{
                    padding: '6px 14px',
                    borderRadius: '6px',
                    backgroundColor: 'var(--accent-telegram-bg)',
                    color: 'var(--accent-telegram)',
                    fontSize: '12.5px',
                    fontWeight: 600,
                  }}
                >
                  Create Your First Group
                </button>
              </div>
            ) : (
              'No conversations found.'
            )}
          </div>
        ) : (
          filteredChats.map(chat => {
            const isActive = chat.id === activeChatId;
            const isGroup = chat.type === 'group';

            return (
              <div
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                className="telegram-press"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '11px 16px',
                  cursor: 'pointer',
                  backgroundColor: isActive ? 'var(--bg-card-hover)' : 'transparent',
                  borderBottom: '1px solid var(--border-subtle)',
                  transition: 'background-color 0.1s ease',
                }}
              >
                {/* Chat Avatar */}
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: isGroup ? '12px' : (chat.type === 'channel' ? '10px' : '50%'),
                  backgroundColor: chat.avatarColor || (chat.type === 'system' ? '#2c394b' : (chat.type === 'channel' ? '#1c2430' : 'var(--accent-base)')),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: chat.avatar ? '20px' : '15px',
                  flexShrink: 0,
                  position: 'relative',
                  boxShadow: 'var(--shadow-sm)',
                }}>
                  {chat.avatar ? (
                    chat.avatar
                  ) : chat.type === 'system' ? (
                    <ShieldCheck size={20} color="#a0b4cc" />
                  ) : chat.type === 'channel' ? (
                    <Radio size={18} color="#8fa8c8" />
                  ) : isGroup ? (
                    <Users size={18} color="#fff" />
                  ) : (
                    chat.title.charAt(0).toUpperCase()
                  )}

                  {chat.isOnline && !isGroup && (
                    <span style={{
                      position: 'absolute',
                      bottom: '0px',
                      right: '0px',
                      width: '9px',
                      height: '9px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--status-online)',
                      border: '2px solid var(--bg-sidebar)',
                    }} />
                  )}
                </div>

                {/* Details */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                    <span style={{
                      fontSize: '13.5px',
                      fontWeight: isActive ? 600 : 500,
                      color: 'var(--text-primary)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {chat.title}
                    </span>
                    {chat.lastMessageTime && (
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {new Date(chat.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: 'var(--text-muted)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {chat.lastMessage || 'No messages yet'}
                  </div>
                </div>

                {/* Unread Pill */}
                {chat.unreadCount > 0 && (
                  <span
                    className="telegram-check-animate"
                    style={{
                      padding: '2px 7px',
                      borderRadius: '12px',
                      backgroundColor: 'var(--accent-telegram)',
                      color: '#ffffff',
                      fontSize: '11px',
                      fontWeight: 700,
                    }}
                  >
                    {chat.unreadCount}
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* New Conversation Modal */}
      {showNewModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div className="telegram-modal-pop" style={{
            width: '380px',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-medium)',
            borderRadius: '14px',
            padding: '24px',
            boxShadow: 'var(--shadow-lg)',
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px' }}>
              Create New Chat or Channel
            </h3>
            <form onSubmit={handleCreateNew} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Title / Contact Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Project Alpha"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    backgroundColor: 'var(--bg-input)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    fontSize: '13px',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Unique @handle
                </label>
                <input
                  type="text"
                  placeholder="e.g. project_alpha"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    backgroundColor: 'var(--bg-input)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    fontSize: '13px',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="telegram-press"
                  style={{ padding: '8px 14px', fontSize: '13px', color: 'var(--text-secondary)' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="telegram-press"
                  style={{
                    padding: '8px 16px',
                    backgroundColor: 'var(--accent-telegram)',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: 500,
                    color: '#fff',
                  }}
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
