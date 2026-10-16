import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';
import { storage } from '../services/storage';
import {
  Users,
  UserPlus,
  MessageSquare,
  Search,
  Check,
  Radio,
  Shield,
  Sparkles,
  ExternalLink,
  MoreVertical
} from 'lucide-react';

interface FriendsViewProps {
  currentUser: User;
  onStartDirectMessage: (user: User) => void;
}

type FriendsSubTab = 'online' | 'all' | 'discover' | 'add_friend';

export const FriendsView: React.FC<FriendsViewProps> = ({
  currentUser,
  onStartDirectMessage,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<FriendsSubTab>('online');
  const [friends, setFriends] = useState<User[]>([]);
  const [networkUsers, setNetworkUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [addFriendInput, setAddFriendInput] = useState('');
  const [addFriendStatus, setAddFriendStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    // Load local friends list
    const loadedFriends = storage.getFriends();
    setFriends(loadedFriends);

    // Fetch live users from server network
    api.fetchUsers().then(users => {
      const filtered = users.filter(u => u.id !== currentUser.id);
      setNetworkUsers(filtered);
    });
  }, [currentUser]);

  const handleAddFriend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addFriendInput.trim()) return;

    setAddFriendStatus(null);
    const target = await api.searchUser(addFriendInput.trim());

    if (!target) {
      setAddFriendStatus({
        type: 'error',
        message: `User "${addFriendInput.trim()}" was not found on the Impuls network. Check spelling or ID.`,
      });
      return;
    }

    if (target.id === currentUser.id) {
      setAddFriendStatus({
        type: 'error',
        message: "You cannot add yourself as a friend.",
      });
      return;
    }

    const updated = storage.addFriend(target);
    setFriends(updated);
    setAddFriendStatus({
      type: 'success',
      message: `Success! Added @${target.username} to your Impuls network contacts.`,
    });
    setAddFriendInput('');
  };

  const handleQuickAdd = (user: User) => {
    const updated = storage.addFriend(user);
    setFriends(updated);
  };

  const onlineFriends = friends.filter(f => f.isOnline);

  const displayList = (() => {
    let source = activeSubTab === 'discover' ? networkUsers : (activeSubTab === 'online' ? onlineFriends : friends);
    if (!searchQuery.trim()) return source;
    const q = searchQuery.toLowerCase();
    return source.filter(u =>
      u.displayName.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q) ||
      (u.bio && u.bio.toLowerCase().includes(q))
    );
  })();

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-chat)' }}>
      {/* Discord-style Top Header */}
      <div style={{
        minHeight: '56px',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        padding: '8px 20px',
        gap: '14px',
        backgroundColor: 'var(--bg-app)',
        zIndex: 5,
        flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
          <Users size={20} color="var(--text-muted)" />
          <span style={{ fontSize: '15px', fontWeight: 600 }}>Friends</span>
        </div>

        <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border-subtle)' }} />

        {/* Tab Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => { setActiveSubTab('online'); setAddFriendStatus(null); }}
            className="telegram-press"
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 500,
              backgroundColor: activeSubTab === 'online' ? 'var(--bg-card-hover)' : 'transparent',
              color: activeSubTab === 'online' ? 'var(--text-primary)' : 'var(--text-secondary)',
            }}
          >
            Online {onlineFriends.length > 0 && <span style={{ marginLeft: '4px', fontSize: '11px', color: 'var(--text-muted)' }}>({onlineFriends.length})</span>}
          </button>

          <button
            onClick={() => { setActiveSubTab('all'); setAddFriendStatus(null); }}
            className="telegram-press"
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 500,
              backgroundColor: activeSubTab === 'all' ? 'var(--bg-card-hover)' : 'transparent',
              color: activeSubTab === 'all' ? 'var(--text-primary)' : 'var(--text-secondary)',
            }}
          >
            All <span style={{ marginLeft: '4px', fontSize: '11px', color: 'var(--text-muted)' }}>({friends.length})</span>
          </button>

          <button
            onClick={() => { setActiveSubTab('discover'); setAddFriendStatus(null); }}
            className="telegram-press"
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 500,
              backgroundColor: activeSubTab === 'discover' ? 'var(--bg-card-hover)' : 'transparent',
              color: activeSubTab === 'discover' ? 'var(--text-primary)' : 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Radio size={14} color="var(--accent-telegram)" />
            <span>Network Directory</span>
          </button>

          <button
            onClick={() => setActiveSubTab('add_friend')}
            className="telegram-press"
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 600,
              backgroundColor: activeSubTab === 'add_friend' ? 'var(--accent-discord-green)' : 'rgba(35, 165, 90, 0.15)',
              color: activeSubTab === 'add_friend' ? '#ffffff' : 'var(--accent-discord-green)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginLeft: '8px',
            }}
          >
            <UserPlus size={15} />
            <span>Add Friend</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left: Friends & Users View */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '24px', overflowY: 'auto' }}>
          {activeSubTab === 'add_friend' ? (
            /* Discord Add Friend View */
            <div className="telegram-modal-pop" style={{ maxWidth: '640px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px', letterSpacing: '0.3px' }}>
                ADD FRIEND
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '18px' }}>
                You can add friends on your private Impuls network with their username or ID (e.g. <code>mahan</code> or <code>schmitz</code>).
              </p>

              <form onSubmit={handleAddFriend} style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'var(--bg-input)',
                border: '1px solid var(--border-medium)',
                borderRadius: '10px',
                padding: '4px 8px 4px 16px',
                marginBottom: '16px',
              }}>
                <input
                  type="text"
                  placeholder="You can add friends with their Impuls username..."
                  value={addFriendInput}
                  onChange={(e) => setAddFriendInput(e.target.value)}
                  style={{
                    flex: 1,
                    backgroundColor: 'transparent',
                    fontSize: '14px',
                    color: 'var(--text-primary)',
                    padding: '8px 0',
                  }}
                />
                <button
                  type="submit"
                  disabled={!addFriendInput.trim()}
                  className="telegram-press"
                  style={{
                    padding: '8px 18px',
                    borderRadius: '6px',
                    backgroundColor: addFriendInput.trim() ? 'var(--accent-discord-green)' : 'rgba(255, 255, 255, 0.08)',
                    color: addFriendInput.trim() ? '#fff' : 'var(--text-muted)',
                    fontSize: '13px',
                    fontWeight: 600,
                  }}
                >
                  Send Request
                </button>
              </form>

              {addFriendStatus && (
                <div style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  backgroundColor: addFriendStatus.type === 'success' ? 'rgba(35, 165, 90, 0.15)' : 'rgba(242, 63, 67, 0.15)',
                  border: `1px solid ${addFriendStatus.type === 'success' ? 'rgba(35, 165, 90, 0.4)' : 'rgba(242, 63, 67, 0.4)'}`,
                  color: addFriendStatus.type === 'success' ? '#4ade80' : '#f87171',
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  {addFriendStatus.type === 'success' ? <Check size={16} /> : <Shield size={16} />}
                  <span>{addFriendStatus.message}</span>
                </div>
              )}

              {/* Suggestions / Network Directory Preview */}
              <div style={{ marginTop: '36px' }}>
                <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Discovered on Impuls Server (80.201.130.248)
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {networkUsers.slice(0, 4).map(user => {
                    const isAlreadyFriend = friends.some(f => f.id === user.id);
                    return (
                      <div
                        key={user.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 14px',
                          borderRadius: '8px',
                          backgroundColor: 'var(--bg-card)',
                          border: '1px solid var(--border-subtle)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            backgroundColor: user.avatarColor || 'var(--accent-base)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            fontWeight: 600,
                            fontSize: '13px',
                          }}>
                            {user.displayName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontSize: '13.5px', fontWeight: 500, color: 'var(--text-primary)' }}>
                              {user.displayName}
                            </div>
                            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                              @{user.username}
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <button
                            onClick={() => onStartDirectMessage(user)}
                            className="telegram-press"
                            title="Direct Message"
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '6px',
                              backgroundColor: 'var(--bg-card-hover)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'var(--text-secondary)',
                            }}
                          >
                            <MessageSquare size={16} />
                          </button>

                          {!isAlreadyFriend ? (
                            <button
                              onClick={() => handleQuickAdd(user)}
                              className="telegram-press"
                              style={{
                                padding: '6px 12px',
                                borderRadius: '6px',
                                backgroundColor: 'var(--accent-telegram-bg)',
                                color: 'var(--accent-telegram)',
                                fontSize: '12px',
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                              }}
                            >
                              <UserPlus size={13} />
                              <span>Add</span>
                            </button>
                          ) : (
                            <span style={{ fontSize: '11.5px', color: 'var(--status-online)', display: 'flex', alignItems: 'center', gap: '4px', padding: '0 8px' }}>
                              <Check size={14} /> Friend
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* Friends List / Directory List */
            <div>
              {/* Search Bar */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '0 12px',
                marginBottom: '20px',
                maxWidth: '480px',
              }}>
                <Search size={14} color="var(--text-muted)" />
                <input
                  type="text"
                  placeholder="Search friends & members..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    backgroundColor: 'transparent',
                    fontSize: '13px',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>

              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.4px' }}>
                {activeSubTab === 'discover'
                  ? `Network Directory • ${displayList.length} Registered Members`
                  : `${activeSubTab.toUpperCase()} • ${displayList.length}`}
              </div>

              {displayList.length === 0 ? (
                <div style={{ padding: '48px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13.5px' }}>
                  No members found in this view.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {displayList.map(user => {
                    const isFriend = friends.some(f => f.id === user.id);
                    return (
                      <div
                        key={user.id}
                        className="telegram-press"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 14px',
                          borderRadius: '8px',
                          backgroundColor: 'var(--bg-card)',
                          border: '1px solid var(--border-subtle)',
                          transition: 'all 0.12s ease',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          {/* Avatar with Status Ring */}
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            backgroundColor: user.avatarColor || 'var(--accent-base)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            fontWeight: 600,
                            fontSize: '15px',
                            position: 'relative',
                          }}>
                            {user.displayName.charAt(0).toUpperCase()}
                            <span style={{
                              position: 'absolute',
                              bottom: '-1px',
                              right: '-1px',
                              width: '10px',
                              height: '10px',
                              borderRadius: '50%',
                              backgroundColor: user.isOnline ? 'var(--status-online)' : 'var(--status-offline)',
                              border: '2px solid var(--bg-card)',
                            }} />
                          </div>

                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                                {user.displayName}
                              </span>
                              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                @{user.username}
                              </span>
                            </div>
                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                              {user.customStatus || user.bio || (user.isOnline ? 'Active on private network' : 'Offline')}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <button
                            onClick={() => onStartDirectMessage(user)}
                            className="telegram-press"
                            title="Direct Message"
                            style={{
                              padding: '6px 14px',
                              borderRadius: '6px',
                              backgroundColor: 'var(--accent-telegram-bg)',
                              color: 'var(--accent-telegram)',
                              fontSize: '12.5px',
                              fontWeight: 500,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                            }}
                          >
                            <MessageSquare size={14} />
                            <span>Message</span>
                          </button>

                          {!isFriend && (
                            <button
                              onClick={() => handleQuickAdd(user)}
                              className="telegram-press"
                              title="Add to Friends"
                              style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '6px',
                                backgroundColor: 'var(--bg-card-hover)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--text-secondary)',
                              }}
                            >
                              <UserPlus size={15} />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Discord-style "Active Now" Column */}
        <div className="discord-active-now-col" style={{
          width: '280px',
          borderLeft: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-sidebar)',
          padding: '24px 18px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          flexShrink: 0,
        }}>
          <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '0.3px' }}>
            Active Now
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {onlineFriends.map(friend => (
              <div
                key={friend.id}
                onClick={() => onStartDirectMessage(friend)}
                className="telegram-press"
                style={{
                  padding: '12px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: friend.avatarColor || 'var(--accent-base)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: '13px',
                    position: 'relative',
                  }}>
                    {friend.displayName.charAt(0).toUpperCase()}
                    <span style={{
                      position: 'absolute',
                      bottom: '0',
                      right: '0',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--status-online)',
                      border: '2px solid var(--bg-card)',
                    }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {friend.displayName}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--status-online)' }}>
                      Online
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  {friend.customStatus || 'Encrypted MTProto 2.0 active'}
                </div>
              </div>
            ))}

            {onlineFriends.length === 0 && (
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', padding: '20px 0' }}>
                It's quiet for now... When friends are online, you'll see their activity here.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
