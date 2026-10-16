import React, { useState, useRef, useEffect } from 'react';
import { Chat, Message, User } from '../types';
import { Send, Paperclip, ShieldCheck, CheckCheck, MoreVertical, Search, Lock } from 'lucide-react';

interface ChatViewProps {
  chat: Chat | null;
  messages: Message[];
  currentUser: User;
  onSendMessage: (text: string) => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  chat,
  messages,
  currentUser,
  onSendMessage,
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!chat) {
    return (
      <div className="main-chat-pane" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <Lock size={28} color="var(--text-muted)" />
          </div>
          <h3 style={{ fontSize: '16px', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '6px' }}>
            No conversation selected
          </h3>
          <p style={{ fontSize: '13px', maxWidth: '280px', margin: '0 auto' }}>
            Choose a conversation from the sidebar or start a new encrypted channel.
          </p>
        </div>
      </div>
    );
  }

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  return (
    <div className="main-chat-pane">
      {/* Top Header */}
      <div style={{
        height: '64px',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        backgroundColor: 'var(--bg-app)',
        zIndex: 5,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--status-online)' }} />
              <span>Encrypted MTProto 2.0 • Server 80.201.130.248</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            title="Search inside chat"
            style={{ width: '32px', height: '32px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}
          >
            <Search size={16} />
          </button>
          <button
            title="More Options"
            style={{ width: '32px', height: '32px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}
          >
            <MoreVertical size={16} />
          </button>
        </div>
      </div>

      {/* Messages Canvas */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}>
        {messages.map((msg) => {
          const isMine = msg.isOutgoing || msg.senderId === currentUser.id;
          return (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: isMine ? 'flex-end' : 'flex-start',
                width: '100%',
              }}
            >
              {/* Sender Name if not mine */}
              {!isMine && (
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '3px', marginLeft: '4px' }}>
                  {msg.senderName}
                </span>
              )}

              {/* Message Card */}
              <div style={{
                maxWidth: '65%',
                backgroundColor: isMine ? 'var(--msg-outgoing)' : 'var(--msg-incoming)',
                border: isMine ? '1px solid var(--msg-outgoing-border)' : '1px solid var(--border-subtle)',
                borderRadius: '10px',
                padding: '10px 14px',
                color: 'var(--text-primary)',
                fontSize: '13.5px',
                lineHeight: 1.5,
                wordBreak: 'break-word',
                boxShadow: 'var(--shadow-sm)',
              }}>
                <div>{msg.text}</div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: '4px',
                  marginTop: '4px',
                  fontSize: '10px',
                  color: 'var(--text-muted)',
                }}>
                  <span>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {isMine && <CheckCheck size={12} color="#8fa8c8" />}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Composer Input Dock */}
      <div style={{
        padding: '16px 24px',
        backgroundColor: 'var(--bg-app)',
        borderTop: '1px solid var(--border-subtle)',
      }}>
        <form onSubmit={handleSend} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          backgroundColor: 'var(--bg-input)',
          border: '1px solid var(--border-medium)',
          borderRadius: '12px',
          padding: '8px 14px',
        }}>
          <button
            type="button"
            title="Attach file"
            style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}
            onClick={() => alert('File vault ready for upload.')}
          >
            <Paperclip size={18} />
          </button>

          <textarea
            placeholder={`Message ${chat.title}...`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              fontSize: '13.5px',
              resize: 'none',
              maxHeight: '120px',
              padding: '4px 0',
            }}
          />

          <button
            type="submit"
            disabled={!inputText.trim()}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: inputText.trim() ? 'var(--accent-base)' : 'transparent',
              color: inputText.trim() ? '#fff' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease',
            }}
          >
            <Send size={15} />
          </button>
        </form>
      </div>
    </div>
  );
};
