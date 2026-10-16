import React, { useState } from 'react';
import { Chat, TabType } from '../types';
import { Search, Plus, ShieldCheck, Radio, User as UserIcon } from 'lucide-react';

interface ChatListProps {
  chats: Chat[];
  activeChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onNewChat: (title: string, username: string) => void;
  currentTab: TabType;
}

export const ChatList: React.FC<ChatListProps> = ({
  chats,
  activeChatId,
  onSelectChat,
  onNewChat,
  currentTab,
}) => {
  const [search, setSearch] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newUsername, setNewUsername] = useState('');

  const filteredChats = chats.filter(chat => {
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

  return (
    <div className="sidebar-panel">
      {/* Top Header & Search */}
      <div style={{ padding: '16px', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
            {currentTab === 'channels' ? 'Channels & Groups' : 'Conversations'}
          </h2>
          <button
            onClick={() => setShowNewModal(true)}
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
            placeholder="Search conversations..."
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
          <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
            No conversations found.
          </div>
        ) : (
          filteredChats.map(chat => {
            const isActive = chat.id === activeChatId;
            return (
              <div
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  cursor: 'pointer',
                  backgroundColor: isActive ? 'var(--bg-card-hover)' : 'transparent',
                  borderBottom: '1px solid var(--border-subtle)',
                  transition: 'background-color 0.1s ease',
                }}
              >
                {/* Chat Avatar */}
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: chat.type === 'channel' ? '10px' : '50%',
                  backgroundColor: chat.type === 'system' ? '#2c394b' : (chat.type === 'channel' ? '#1c2430' : 'var(--accent-base)'),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '14px',
                  flexShrink: 0,
                }}>
                  {chat.type === 'system' ? (
                    <ShieldCheck size={20} color="#a0b4cc" />
                  ) : chat.type === 'channel' ? (
                    <Radio size={18} color="#8fa8c8" />
                  ) : (
                    chat.title.charAt(0).toUpperCase()
                  )}
                </div>

                {/* Details */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                    <span style={{
                      fontSize: '13px',
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
                  <span style={{
                    padding: '2px 6px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--accent-badge)',
                    color: 'var(--accent-badge-text)',
                    fontSize: '11px',
                    fontWeight: 600,
                  }}>
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
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
        }}>
          <div style={{
            width: '360px',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-medium)',
            borderRadius: '12px',
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
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  style={{ padding: '8px 14px', fontSize: '13px', color: 'var(--text-secondary)' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '8px 16px',
                    backgroundColor: 'var(--accent-base)',
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
