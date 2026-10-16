import React, { useState, useRef, useEffect } from 'react';
import { Chat, Message, User } from '../types';
import { storage } from '../services/storage';
import {
  Send,
  Paperclip,
  ShieldCheck,
  CheckCheck,
  Check,
  MoreVertical,
  Search,
  Lock,
  Smile,
  Mic,
  Users,
  Radio,
  Phone,
  Video,
  ArrowDown,
  ArrowLeft,
  X,
  UserPlus
} from 'lucide-react';

interface ChatViewProps {
  chat: Chat | null;
  messages: Message[];
  currentUser: User;
  onSendMessage: (text: string) => void;
  onOpenGroupInfo?: (chat: Chat) => void;
  onBack?: () => void;
}

const QUICK_REACTIONS = ['👍', '❤️', '🔥', '😂', '👏', '🚀'];

const EMOJI_PALETTE = [
  '😀', '😂', '😍', '🔥', '👍', '❤️', '🚀', '⚡',
  '🎉', '😎', '👏', '💯', '🙌', '✨', '💎', '🛡️',
  '🔒', '💬', '👀', '💡', '🏆', '🎮', '☕', '🌟'
];

export const ChatView: React.FC<ChatViewProps> = ({
  chat,
  messages,
  currentUser,
  onSendMessage,
  onOpenGroupInfo,
  onBack,
}) => {
  const [inputText, setInputText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const [showGroupDrawer, setShowGroupDrawer] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => prev === msg ? null : prev);
    }, 3200);
  };
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleScroll = () => {
    if (!messagesContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    const isUp = scrollHeight - scrollTop - clientHeight > 180;
    setShowScrollBottom(isUp);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
    setShowEmojiPicker(false);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  const insertEmoji = (emoji: string) => {
    setInputText(prev => prev + emoji);
    textareaRef.current?.focus();
  };

  const handleReaction = (messageId: string, emoji: string) => {
    if (!chat) return;
    storage.toggleReaction(chat.id, messageId, emoji);
    setHoveredMessageId(null);
  };

  if (!chat) {
    return (
      <div className="main-chat-pane" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div className="telegram-bubble-pop" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
          <div style={{
            width: '68px',
            height: '68px',
            borderRadius: '20px',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-medium)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 18px',
            boxShadow: 'var(--shadow-md)',
          }}>
            <Lock size={30} color="var(--accent-telegram)" />
          </div>
          <h3 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
            Select a conversation
          </h3>
          <p style={{ fontSize: '13px', maxWidth: '300px', margin: '0 auto', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Pick a contact from the left, open an encrypted channel, or create an instant WhatsApp-style group.
          </p>
        </div>
      </div>
    );
  }

  const isGroup = chat.type === 'group';
  const memberCount = chat.members?.length || (isGroup ? 4 : 2);

  return (
    <div className="main-chat-pane">
      {/* Sleek In-App Toast Notification */}
      {toastMessage && (
        <div className="telegram-toast-banner">
          <ShieldCheck size={16} color="var(--accent-telegram)" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Telegram-style Top Header */}
      <div style={{
        height: '60px',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        backgroundColor: 'var(--bg-app)',
        zIndex: 10,
        boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
      }}>
        {/* Chat Avatar & Details with Mobile Back Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
          {onBack && (
            <button
              onClick={onBack}
              className="mobile-back-btn telegram-press"
              title="Back to conversations"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-primary)',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              <ArrowLeft size={18} />
            </button>
          )}

          <div
            onClick={() => isGroup && setShowGroupDrawer(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              cursor: isGroup ? 'pointer' : 'default',
              minWidth: 0,
            }}
          >
            {/* Avatar with Status Ring */}
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: isGroup ? '12px' : '50%',
              backgroundColor: chat.avatarColor || (chat.type === 'system' ? '#2c394b' : 'var(--accent-base)'),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 600,
              fontSize: chat.avatar ? '20px' : '15px',
              position: 'relative',
              flexShrink: 0,
              boxShadow: 'var(--shadow-sm)',
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
                  bottom: '0',
                  right: '0',
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--status-online)',
                  border: '2px solid var(--bg-app)',
                }} />
              )}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {chat.title}
                </h2>
                {chat.username && (
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    @{chat.username}
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', marginTop: '2px' }}>
                {isGroup ? (
                  <span style={{ color: 'var(--accent-telegram)' }}>
                    {memberCount} members • WhatsApp Group Sync
                  </span>
                ) : chat.type === 'system' ? (
                  <span style={{ color: 'var(--status-online)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--status-online)' }} />
                    Encrypted MTProto 2.0 • Server 80.201.130.248
                  </span>
                ) : (
                  <span style={{ color: 'var(--status-online)' }}>
                    online
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Top Header Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
          <button
            title="Search conversation"
            className="telegram-press"
            style={{ width: '34px', height: '34px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}
          >
            <Search size={17} />
          </button>

          <button
            title="Encrypted Voice Call"
            className="telegram-press"
            style={{ width: '34px', height: '34px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}
            onClick={() => showToast('Encrypted MTProto Voice Tunnel initialized on 80.201.130.248')}
          >
            <Phone size={17} />
          </button>

          <button
            title="More options"
            className="telegram-press"
            style={{ width: '34px', height: '34px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}
          >
            <MoreVertical size={17} />
          </button>
        </div>
      </div>

      {/* Messages Canvas with Telegram wallpaper effect */}
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="telegram-messages-canvas"
      >
        {/* Telegram Date Separator Pill */}
        <div className="telegram-date-separator">
          Today, {new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
        </div>

        {messages.map((msg, index) => {
          const isMine = msg.isOutgoing || msg.senderId === currentUser.id;
          const isHovered = hoveredMessageId === msg.id;

          return (
            <div
              key={msg.id}
              onMouseEnter={() => setHoveredMessageId(msg.id)}
              onMouseLeave={() => setHoveredMessageId(null)}
              className="telegram-bubble-pop"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: isMine ? 'flex-end' : 'flex-start',
                width: '100%',
                position: 'relative',
              }}
            >
              {/* Sender Name in Group Chat */}
              {!isMine && isGroup && (
                <span style={{
                  fontSize: '11.5px',
                  fontWeight: 600,
                  color: msg.senderColor || 'var(--accent-telegram)',
                  marginBottom: '3px',
                  marginLeft: '8px',
                }}>
                  {msg.senderName}
                </span>
              )}

              {/* Message Bubble Container with Floating Reaction Bar */}
              <div className="telegram-bubble-wrap">
                {/* Floating Quick Reaction Bar on Hover */}
                {isHovered && (
                  <div
                    className="telegram-reactions-bar"
                    style={{
                      right: isMine ? '0' : 'auto',
                      left: isMine ? 'auto' : '0',
                    }}
                  >
                    {QUICK_REACTIONS.map(emoji => (
                      <span
                        key={emoji}
                        onClick={() => handleReaction(msg.id, emoji)}
                        className="telegram-reaction-btn"
                        title={`React with ${emoji}`}
                      >
                        {emoji}
                      </span>
                    ))}
                  </div>
                )}

                {/* Message Bubble */}
                <div
                  className={`telegram-bubble ${isMine ? 'outgoing' : 'incoming'}`}
                >
                  <div className="telegram-bubble-body">
                    <span className="telegram-bubble-text">{msg.text}</span>

                    {/* Timestamp & Telegram Checkmarks */}
                    <span className="telegram-bubble-meta">
                      <span className="telegram-bubble-time">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {isMine && (
                        <span className="telegram-check-animate telegram-bubble-ticks">
                          <CheckCheck size={13} color="var(--msg-check)" />
                        </span>
                      )}
                    </span>
                  </div>
                </div>

                {/* Attached Reactions Pills */}
                {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '3px', gap: '4px' }}>
                    {Object.entries(msg.reactions).map(([emoji, count]) => (
                      <span
                        key={emoji}
                        onClick={() => handleReaction(msg.id, emoji)}
                        className="telegram-reaction-pill"
                      >
                        <span>{emoji}</span>
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>{count}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* Floating Scroll to Bottom Button */}
      {showScrollBottom && (
        <button
          onClick={scrollToBottom}
          className="telegram-press"
          style={{
            position: 'absolute',
            bottom: '84px',
            right: '32px',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-medium)',
            boxShadow: 'var(--shadow-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-telegram)',
            zIndex: 30,
          }}
        >
          <ArrowDown size={18} />
        </button>
      )}

      {/* Floating Emoji Picker Popover */}
      {showEmojiPicker && (
        <div
          className="telegram-modal-pop"
          style={{
            position: 'absolute',
            bottom: '76px',
            left: '24px',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-medium)',
            borderRadius: '12px',
            padding: '12px',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 100,
            width: '260px',
          }}
        >
          <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>
            Quick Emojis
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(8, 1fr)',
            gap: '6px',
          }}>
            {EMOJI_PALETTE.map(emoji => (
              <button
                key={emoji}
                onClick={() => insertEmoji(emoji)}
                style={{
                  fontSize: '18px',
                  padding: '4px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'transform 0.1s ease',
                }}
                className="telegram-press"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Telegram-style Composer Input Dock */}
      <div className="telegram-input-container" style={{
        borderTop: '1px solid var(--border-subtle)',
      }}>
        <form onSubmit={handleSend} style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: '8px',
          backgroundColor: 'var(--bg-input)',
          border: '1px solid var(--border-medium)',
          borderRadius: '14px',
          padding: '6px 12px',
        }}>
          {/* Emoji Toggle */}
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            title="Emoji & Stickers"
            className="telegram-press"
            style={{
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: showEmojiPicker ? 'var(--accent-telegram)' : 'var(--text-muted)',
              marginBottom: '2px',
            }}
          >
            <Smile size={19} />
          </button>

          {/* Attachment Button */}
          <button
            type="button"
            title="Attach file or photo"
            className="telegram-press"
            style={{
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
              marginBottom: '2px',
            }}
            onClick={() => showToast('Impuls File Vault: Drag & drop encrypted media supported.')}
          >
            <Paperclip size={19} />
          </button>

          {/* Auto-expanding Input Area */}
          <textarea
            ref={textareaRef}
            placeholder={`Message ${chat.title}...`}
            value={inputText}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            rows={1}
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              fontSize: '13.5px',
              resize: 'none',
              maxHeight: '120px',
              padding: '6px 4px',
              lineHeight: 1.4,
              color: 'var(--text-primary)',
            }}
          />

          {/* Dynamic Send / Mic Action Button */}
          {inputText.trim() ? (
            <button
              type="submit"
              className="telegram-press telegram-check-animate"
              title="Send message (Enter)"
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent-telegram)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '2px',
                boxShadow: '0 2px 8px rgba(46, 166, 255, 0.4)',
              }}
            >
              <Send size={15} style={{ marginLeft: '1px' }} />
            </button>
          ) : (
            <button
              type="button"
              className="telegram-press"
              title="Voice Message (Hold to record)"
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted)',
                marginBottom: '2px',
              }}
              onClick={() => showToast('Encrypted Voice Note recording ready.')}
            >
              <Mic size={18} />
            </button>
          )}
        </form>
      </div>

      {/* WhatsApp-Style Group Info Drawer */}
      {showGroupDrawer && isGroup && (
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          width: 'min(320px, 100vw)',
          maxWidth: '100%',
          backgroundColor: 'var(--bg-sidebar)',
          borderLeft: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          animation: 'telegramBubbleInRight 0.2s var(--ease-spring)',
        }}>
          {/* Drawer Header */}
          <div style={{
            height: '60px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 18px',
          }}>
            <span style={{ fontSize: '15px', fontWeight: 600 }}>Group Info</span>
            <button
              onClick={() => setShowGroupDrawer(false)}
              className="telegram-press"
              style={{ color: 'var(--text-muted)' }}
            >
              <X size={18} />
            </button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 18px' }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{
                width: '68px',
                height: '68px',
                borderRadius: '18px',
                backgroundColor: chat.avatarColor || 'var(--accent-telegram)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                margin: '0 auto 12px',
                boxShadow: 'var(--shadow-md)',
              }}>
                {chat.avatar || '💬'}
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>
                {chat.title}
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Group • {memberCount} participants
              </p>
            </div>

            {chat.description && (
              <div style={{
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                fontSize: '12.5px',
                color: 'var(--text-secondary)',
                marginBottom: '20px',
              }}>
                {chat.description}
              </div>
            )}

            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px' }}>
              {memberCount} Participants
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 10px',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-card)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--accent-telegram)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 600,
                    fontSize: '12px',
                    color: '#fff',
                  }}>
                    {currentUser.displayName.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 500 }}>{currentUser.displayName} (You)</div>
                    <div style={{ fontSize: '11px', color: 'var(--status-online)' }}>Online</div>
                  </div>
                </div>
                <span style={{ fontSize: '10.5px', color: 'var(--accent-telegram)', backgroundColor: 'var(--accent-telegram-bg)', padding: '2px 6px', borderRadius: '4px' }}>
                  Admin
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
