import React, { useState, useEffect } from 'react';
import { User, Chat } from '../types';
import { api } from '../services/api';
import { storage } from '../services/storage';
import { Search, X, Check, ArrowRight, ArrowLeft, Users, Sparkles } from 'lucide-react';

interface NewGroupModalProps {
  currentUser: User;
  onClose: () => void;
  onGroupCreated: (group: Chat) => void;
}

const AVATAR_COLORS = [
  '#2ea6ff', // Telegram Cyan
  '#7bc862', // WhatsApp Emerald
  '#a695e7', // Violet
  '#e17076', // Coral
  '#faa357', // Amber
  '#65aadd', // Steel
  '#23a55a', // Discord Green
];

const GROUP_EMOJIS = ['🚀', '💬', '⚡', '🛡️', '🌐', '🔒', '🔥', '💎', '🎮', '💡'];

export const NewGroupModal: React.FC<NewGroupModalProps> = ({
  currentUser,
  onClose,
  onGroupCreated,
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [search, setSearch] = useState('');
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [groupTitle, setGroupTitle] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState(AVATAR_COLORS[0]);
  const [selectedEmoji, setSelectedEmoji] = useState(GROUP_EMOJIS[0]);

  useEffect(() => {
    // Load network users & saved friends
    api.fetchUsers().then(users => {
      const filtered = users.filter(u => u.id !== currentUser.id);
      setAvailableUsers(filtered);
    });
  }, [currentUser]);

  const toggleSelectUser = (userId: string) => {
    setSelectedUserIds(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const removeUser = (userId: string) => {
    setSelectedUserIds(prev => prev.filter(id => id !== userId));
  };

  const filteredUsers = availableUsers.filter(u => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return u.displayName.toLowerCase().includes(q) || u.username.toLowerCase().includes(q);
  });

  const selectedUsers = availableUsers.filter(u => selectedUserIds.includes(u.id));

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupTitle.trim()) return;

    const newGroupId = `chat_group_${Date.now()}`;
    const newGroup: Chat = {
      id: newGroupId,
      title: groupTitle.trim(),
      type: 'group',
      username: groupTitle.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_'),
      avatar: selectedEmoji,
      avatarColor: selectedColor,
      description: groupDescription.trim() || 'Private encrypted group room',
      lastMessage: `You created group "${groupTitle.trim()}"`,
      lastMessageTime: Date.now(),
      unreadCount: 0,
      members: [currentUser.id, ...selectedUserIds],
      isOnline: true,
    };

    // Initialize initial system message in group
    storage.addMessage(newGroupId, {
      id: `msg_sys_group_${Date.now()}`,
      chatId: newGroupId,
      senderId: 'system',
      senderName: 'Impuls System',
      text: `${currentUser.displayName} created group "${groupTitle.trim()}" with ${selectedUserIds.length + 1} members. All messages are end-to-end encrypted.`,
      timestamp: Date.now(),
      isOutgoing: false,
      isRead: true,
      reactions: { '🎉': 1 },
    });

    onGroupCreated(newGroup);
    onClose();
  };

  return (
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
        width: '440px',
        maxHeight: '620px',
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-medium)',
        borderRadius: '14px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'var(--shadow-lg)',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'var(--bg-titlebar)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {step === 2 && (
              <button
                type="button"
                onClick={() => setStep(1)}
                className="telegram-press"
                style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center' }}
              >
                <ArrowLeft size={18} />
              </button>
            )}
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
                {step === 1 ? 'Add Group Members' : 'New Group Details'}
              </h3>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                {step === 1
                  ? `${selectedUserIds.length} of ${availableUsers.length} selected`
                  : 'WhatsApp-style instant room creation'}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="telegram-press"
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* STEP 1: Select Members */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '480px' }}>
            {/* Search Input */}
            <div style={{ padding: '12px 18px', borderBottom: '1px solid var(--border-subtle)' }}>
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
                  placeholder="Search network members..."
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

              {/* Selected User Chips */}
              {selectedUsers.length > 0 && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginTop: '10px',
                  overflowX: 'auto',
                  paddingBottom: '4px',
                }}>
                  {selectedUsers.map(user => (
                    <div
                      key={user.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 8px',
                        borderRadius: '16px',
                        backgroundColor: 'var(--accent-telegram-bg)',
                        border: '1px solid rgba(46, 166, 255, 0.25)',
                        fontSize: '11.5px',
                        color: 'var(--accent-telegram)',
                        flexShrink: 0,
                      }}
                    >
                      <span>{user.displayName}</span>
                      <button
                        onClick={() => removeUser(user.id)}
                        style={{ display: 'flex', alignItems: 'center', color: 'var(--accent-telegram)' }}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Users List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '6px 0' }}>
              {filteredUsers.length === 0 ? (
                <div style={{ padding: '36px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                  No members found.
                </div>
              ) : (
                filteredUsers.map(user => {
                  const isSelected = selectedUserIds.includes(user.id);
                  return (
                    <div
                      key={user.id}
                      onClick={() => toggleSelectUser(user.id)}
                      className="telegram-press"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 18px',
                        cursor: 'pointer',
                        backgroundColor: isSelected ? 'var(--bg-card-hover)' : 'transparent',
                        borderBottom: '1px solid var(--border-subtle)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {/* Avatar */}
                        <div style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '50%',
                          backgroundColor: user.avatarColor || 'var(--accent-base)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#fff',
                          fontWeight: 600,
                          fontSize: '14px',
                          position: 'relative',
                        }}>
                          {user.displayName.charAt(0).toUpperCase()}
                          {user.isOnline && (
                            <span style={{
                              position: 'absolute',
                              bottom: '0px',
                              right: '0px',
                              width: '9px',
                              height: '9px',
                              borderRadius: '50%',
                              backgroundColor: 'var(--status-online)',
                              border: '2px solid var(--bg-card)',
                            }} />
                          )}
                        </div>

                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>
                            {user.displayName}
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                            @{user.username} {user.bio ? `• ${user.bio}` : ''}
                          </div>
                        </div>
                      </div>

                      {/* Checkbox */}
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        border: isSelected ? 'none' : '2px solid var(--border-medium)',
                        backgroundColor: isSelected ? 'var(--accent-telegram)' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.12s ease',
                      }}>
                        {isSelected && <Check size={13} color="#fff" strokeWidth={3} />}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Bottom Next Bar */}
            <div style={{
              padding: '14px 20px',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'var(--bg-titlebar)',
            }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {selectedUserIds.length === 0 ? 'Select at least 1 member' : `${selectedUserIds.length} members ready`}
              </span>
              <button
                type="button"
                disabled={selectedUserIds.length === 0}
                onClick={() => setStep(2)}
                className="telegram-press"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 18px',
                  borderRadius: '8px',
                  backgroundColor: selectedUserIds.length > 0 ? 'var(--accent-telegram)' : 'var(--bg-card)',
                  color: selectedUserIds.length > 0 ? '#fff' : 'var(--text-muted)',
                  fontSize: '13px',
                  fontWeight: 500,
                  opacity: selectedUserIds.length > 0 ? 1 : 0.6,
                }}
              >
                <span>Next</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Group Info & Create */}
        {step === 2 && (
          <form onSubmit={handleCreateGroup} style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Avatar & Color Customization */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '16px',
                backgroundColor: selectedColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                boxShadow: 'var(--shadow-sm)',
                flexShrink: 0,
              }}>
                {selectedEmoji}
              </div>

              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Choose Emoji Badge
                </span>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {GROUP_EMOJIS.map(emoji => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setSelectedEmoji(emoji)}
                      style={{
                        fontSize: '16px',
                        padding: '3px',
                        borderRadius: '6px',
                        backgroundColor: selectedEmoji === emoji ? 'var(--bg-card-hover)' : 'transparent',
                        border: selectedEmoji === emoji ? '1px solid var(--accent-telegram)' : '1px solid transparent',
                      }}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Color Accent Picker */}
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                Group Color Theme
              </span>
              <div style={{ display: 'flex', gap: '8px' }}>
                {AVATAR_COLORS.map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: color,
                      border: selectedColor === color ? '2px solid #fff' : '2px solid transparent',
                      cursor: 'pointer',
                      transition: 'transform 0.1s ease',
                      transform: selectedColor === color ? 'scale(1.15)' : 'scale(1)',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Group Title */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  Group Subject / Name
                </label>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {groupTitle.length}/32
                </span>
              </div>
              <input
                type="text"
                placeholder="e.g. Core Engineering"
                value={groupTitle}
                onChange={(e) => setGroupTitle(e.target.value.slice(0, 32))}
                required
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: '8px',
                  fontSize: '13.5px',
                  color: 'var(--text-primary)',
                }}
              />
            </div>

            {/* Group Description */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                Group Description (Optional)
              </label>
              <textarea
                placeholder="Describe what this room is for..."
                value={groupDescription}
                onChange={(e) => setGroupDescription(e.target.value)}
                rows={2}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  fontSize: '13px',
                  color: 'var(--text-primary)',
                  resize: 'none',
                }}
              />
            </div>

            {/* Selected Members Summary */}
            <div style={{
              padding: '10px 12px',
              borderRadius: '8px',
              backgroundColor: 'var(--bg-input)',
              border: '1px solid var(--border-subtle)',
              fontSize: '12px',
              color: 'var(--text-secondary)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', fontWeight: 500 }}>
                <Users size={14} color="var(--accent-telegram)" />
                <span>{selectedUsers.length + 1} Total Participants</span>
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                You, {selectedUsers.map(u => u.displayName).join(', ')}
              </p>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="telegram-press"
                style={{ padding: '8px 16px', fontSize: '13px', color: 'var(--text-secondary)' }}
              >
                Back
              </button>
              <button
                type="submit"
                disabled={!groupTitle.trim()}
                className="telegram-press"
                style={{
                  padding: '8px 20px',
                  backgroundColor: 'var(--accent-telegram)',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: '#fff',
                  opacity: groupTitle.trim() ? 1 : 0.6,
                }}
              >
                Create Group
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
