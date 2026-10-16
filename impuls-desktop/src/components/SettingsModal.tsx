import React, { useState } from 'react';
import { User } from '../types';
import { X, ShieldCheck, Server, Sparkles, User as UserIcon } from 'lucide-react';

interface SettingsModalProps {
  user: User;
  onClose: () => void;
  onUpdateUser: (updated: User) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  user,
  onClose,
  onUpdateUser,
}) => {
  const [displayName, setDisplayName] = useState(user.displayName);
  const [bio, setBio] = useState(user.bio || '');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      displayName: displayName.trim() || user.displayName,
      bio: bio.trim(),
    });
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
    }}>
      <div style={{
        width: '440px',
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-medium)',
        borderRadius: '16px',
        padding: '28px',
        boxShadow: 'var(--shadow-lg)',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--text-primary)' }}>
            Settings & Profile
          </h2>
          <button
            onClick={onClose}
            style={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* User ID & Pro Badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 14px',
            backgroundColor: 'var(--bg-input)',
            borderRadius: '10px',
            border: '1px solid var(--border-subtle)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                backgroundColor: 'var(--accent-base)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 600,
              }}>
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  @{user.username}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Impuls ID: {user.id}
                </div>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 8px',
              backgroundColor: 'var(--accent-badge)',
              color: 'var(--accent-badge-text)',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: 600,
            }}>
              <Sparkles size={12} />
              Pro Active
            </div>
          </div>

          {/* Edit Display Name */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                backgroundColor: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                fontSize: '13px',
              }}
            />
          </div>

          {/* Bio */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
              Bio / Status
            </label>
            <input
              type="text"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                backgroundColor: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                fontSize: '13px',
              }}
            />
          </div>

          {/* Network Connection Info */}
          <div style={{
            padding: '12px 14px',
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '10px',
            fontSize: '12px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              <Server size={14} />
              <span style={{ fontWeight: 500 }}>Private Server Infrastructure</span>
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: '11px', lineHeight: 1.5, fontFamily: 'var(--font-mono)' }}>
              Gateway: 80.201.130.248:20443 (TCP)<br />
              Media Stream: 80.201.130.248:20543<br />
              Encryption: MTProto 2.0 (Diffie-Hellman 2048-bit)
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{ padding: '8px 16px', fontSize: '13px', color: 'var(--text-secondary)' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: '8px 18px',
                backgroundColor: 'var(--accent-base)',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 500,
                color: '#fff',
              }}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
