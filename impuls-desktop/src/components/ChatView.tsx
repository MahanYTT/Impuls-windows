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
} from 'lucide-react';

interface ChatViewProps {
  chat: Chat | null;
  messages: Message[];
  currentUser: User;
  onSendMessage: (text: string) => void;
  onToggleReadMessage?: (messageId: string) => void;
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
  onToggleReadMessage,
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

  const handleToggleRead = (messageId: string) => {
    if (onToggleReadMessage) {
      onToggleReadMessage(messageId);
    } else if (chat) {
      const currentMsgs = storage.getMessages(chat.id);
      const updated = currentMsgs.map(m => m.id === messageId ? { ...m, isRead: !m.isRead } : m);
      storage.saveMessages(chat.id, updated);
      showToast('Toggled message read status');
    }
  };

  if (!chat) {
    return (
      <div className="main-chat-pane" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
          <div style={{
            width: '68px',
            height: '68px',
            borderRadius: '50%',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-medium)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 18px',
          }}>
            <Lock size={30} color="var(--accent-whatsapp)" />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '8px' }}>
            Impuls for Windows & Web
          </h3>
          <p style={{ fontSize: '13.5px', maxWidth: '340px', margin: '0 auto', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Send and receive end-to-end encrypted messages, create instant company groups, and collaborate securely.
          </p>
        </div>
      </div>
    );
  }

  const isGroup = chat.type === 'group';
  const memberCount = chat.members?.length || (isGroup ? 4 : 2);

  return (
    <div className="main-chat-pane">
      {/* In-App Toast Notification */}
      {toastMessage && (
        <div className="telegram-toast-banner">
          <ShieldCheck size={16} color="var(--accent-whatsapp)" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* WhatsApp Official Top Header (Height 59px, #202c33) */}
      <div style={{
        height: '59px',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        backgroundColor: 'var(--bg-chat-header)',
        zIndex: 10,
        flexShrink: 0,
      }}>
        {/* Chat Avatar & Details with Mobile Back Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
          {onBack && (
            <button
              onClick={onBack}
              className="mobile-back-btn"
              title="Back to conversations"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-primary)',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              <ArrowLeft size={20} />
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
            {/* WhatsApp Avatar */}
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: chat.avatarColor || (chat.type === 'system' ? '#2c394b' : 'var(--accent-whatsapp-dark)'),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 600,
              fontSize: chat.avatar ? '19px' : '15px',
              position: 'relative',
              flexShrink: 0,
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
                  bottom: '1px',
                  right: '1px',
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--status-online)',
                  border: '2px solid var(--bg-chat-header)',
                }} />
              )}
            </div>

            {/* Name & Status */}
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
                {chat.username && (
                  <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                    @{chat.username}
                  </span>
                )}
              </div>
              <span style={{
                fontSize: '12.5px',
                color: chat.isOnline ? 'var(--status-online)' : 'var(--text-muted)',
                lineHeight: 1.2,
                marginTop: '1px',
              }}>
                {chat.isOnline ? 'online' : (isGroup ? `${memberCount} participants` : 'last seen recently')}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            title="Search in conversation"
            className="wa-dock-icon-btn"
            onClick={() => showToast('Search within messages ready.')}
          >
            <Search size={19} />
          </button>

          {!isGroup && (
            <>
              <button
                title="Encrypted Voice Call"
                className="wa-dock-icon-btn"
                onClick={() => showToast('Connecting encrypted voice channel...')}
              >
                <Phone size={19} />
              </button>
              <button
                title="HD Video Stream"
                className="wa-dock-icon-btn"
                onClick={() => showToast('Peer video stream initializing...')}
              >
                <Video size={19} />
              </button>
            </>
          )}

          <button
            title="Menu & Options"
            className="wa-dock-icon-btn"
            onClick={() => isGroup ? setShowGroupDrawer(true) : showToast('Chat encryption verified via MTProto 2.0')}
          >
            <MoreVertical size={19} />
          </button>
        </div>
      </div>

      {/* WhatsApp Message Canvas */}
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="telegram-messages-canvas"
      >
        {/* End-to-End Encryption Pill */}
        <div className="wa-encryption-pill">
          <Lock size={13} color="#ffd279" />
          <span>Messages are end-to-end encrypted. No one outside of this chat can read or listen to them.</span>
        </div>

        {/* Date Separator Pill */}
        <div className="wa-date-pill">Today</div>

        {/* Message List */}
        {messages.map((msg) => {
          const isMine = msg.senderId === currentUser?.id || msg.isOutgoing;
          const isHovered = hoveredMessageId === msg.id;
          const showSenderName = isGroup && !isMine;
          const timeStr = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

          return (
            <div
              key={msg.id}
              className={`wa-message-row ${isMine ? 'outgoing' : 'incoming'}`}
              onMouseEnter={() => setHoveredMessageId(msg.id)}
              onMouseLeave={() => setHoveredMessageId(null)}
            >
              <div className="wa-bubble-wrap">
                {/* Floating Reaction Bar on Hover */}
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

                {/* Sender Name in Group */}
                {showSenderName && (
                  <span style={{
                    fontSize: '12.5px',
                    fontWeight: 600,
                    color: msg.senderColor || 'var(--accent-whatsapp)',
                    marginBottom: '2px',
                    paddingLeft: '4px',
                  }}>
                    {msg.senderName}
                  </span>
                )}

                {/* WhatsApp Compact Message Bubble */}
                <div className={`wa-bubble ${isMine ? 'outgoing' : 'incoming'}`}>
                  <span className="wa-bubble-text">{msg.text}</span>

                  {/* WhatsApp Inlined Timestamp & Read Receipt Checkmarks */}
                  <span className="wa-bubble-meta">
                    <span className="wa-bubble-time">{timeStr}</span>
                    {isMine && (
                      <span
                        className="wa-bubble-ticks"
                        title={msg.isRead ? "Read by recipient (Click to toggle)" : "Delivered to device (Click to toggle)"}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleRead(msg.id);
                        }}
                      >
                        {msg.isRead ? (
                          <CheckCheck size={16} color="var(--wa-check-read)" strokeWidth={2.5} />
                        ) : (
                          <Check size={15} color="var(--wa-check-unread)" strokeWidth={2.3} />
                        )}
                      </span>
                    )}
                  </span>
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
          className="wa-dock-icon-btn"
          style={{
            position: 'absolute',
            bottom: '76px',
            right: '28px',
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-medium)',
            color: 'var(--accent-whatsapp)',
            zIndex: 30,
          }}
          title="Scroll to bottom"
        >
          <ArrowDown size={20} />
        </button>
      )}

      {/* Floating Emoji Picker Popover */}
      {showEmojiPicker && (
        <div
          className="telegram-modal-pop"
          style={{
            position: 'absolute',
            bottom: '72px',
            left: '16px',
            backgroundColor: 'var(--bg-popover)',
            border: '1px solid var(--border-medium)',
            borderRadius: '10px',
            padding: '12px',
            zIndex: 100,
            width: '280px',
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
                className="telegram-press"
                style={{
                  fontSize: '18px',
                  padding: '4px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* WhatsApp Official Docked Bottom Composer */}
      <div className="wa-input-dock">
        {/* Emoji Button */}
        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="wa-dock-icon-btn"
          title="Emojis & Stickers"
        >
          <Smile size={24} />
        </button>

        {/* Attachment Button */}
        <button
          type="button"
          className="wa-dock-icon-btn"
          title="Attach files, media, or contacts"
          onClick={() => showToast('Impuls Vault: Attach encrypted documents & media.')}
        >
          <Paperclip size={22} />
        </button>

        {/* Input Text Area Container */}
        <div className="wa-input-field-wrap">
          <textarea
            ref={textareaRef}
            placeholder="Type a message"
            value={inputText}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            rows={1}
            className="wa-textarea"
          />
        </div>

        {/* Dynamic Mic / Send Action Button */}
        {inputText.trim() ? (
          <button
            type="button"
            onClick={handleSend}
            className="wa-dock-send-btn"
            title="Send message"
          >
            <Send size={18} strokeWidth={2.4} />
          </button>
        ) : (
          <button
            type="button"
            className="wa-dock-icon-btn"
            title="Voice Note (Hold to record)"
            onClick={() => showToast('Voice note encryption channel ready.')}
          >
            <Mic size={24} />
          </button>
        )}
      </div>

      {/* WhatsApp-Style Group Info Drawer */}
      {showGroupDrawer && isGroup && (
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          width: 'min(340px, 100vw)',
          maxWidth: '100%',
          backgroundColor: 'var(--bg-sidebar)',
          borderLeft: '1px solid var(--border-subtle)',
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          animation: 'telegramBubbleInRight 0.2s var(--ease-spring)',
        }}>
          {/* Drawer Header */}
          <div style={{
            height: '59px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 18px',
            backgroundColor: 'var(--bg-chat-header)',
          }}>
            <span style={{ fontSize: '16px', fontWeight: 500, color: 'var(--text-primary)' }}>Group Info</span>
            <button
              onClick={() => setShowGroupDrawer(false)}
              className="wa-dock-icon-btn"
            >
              <X size={20} />
            </button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '20px 18px' }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                backgroundColor: chat.avatarColor || 'var(--accent-whatsapp-dark)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                margin: '0 auto 12px',
              }}>
                {chat.avatar || '👥'}
              </div>
              <h3 style={{ fontSize: '17px', fontWeight: 500, color: 'var(--text-primary)' }}>
                {chat.title}
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Group • {memberCount} participants
              </p>
            </div>

            {chat.description && (
              <div style={{
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                marginBottom: '16px',
              }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Description
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
                  {chat.description}
                </div>
              </div>
            )}

            {/* Participants list */}
            <div>
              <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '10px' }}>
                Participants ({memberCount})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 0' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--accent-whatsapp)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 600 }}>
                    {currentUser.displayName.charAt(0)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', color: 'var(--text-primary)' }}>You</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Online</div>
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--accent-whatsapp)', backgroundColor: 'rgba(0,168,132,0.15)', padding: '2px 6px', borderRadius: '4px' }}>Admin</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
