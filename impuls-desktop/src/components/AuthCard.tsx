import React, { useState } from 'react';
import { ImpulsLogo } from '../assets/Logo';
import { User } from '../types';
import { Lock, User as UserIcon, Shield, ArrowRight, CheckCircle2 } from 'lucide-react';

import { api } from '../services/api';

interface AuthCardProps {
  onSuccess: (user: User) => void;
}

export const AuthCard: React.FC<AuthCardProps> = ({ onSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Please enter your Impuls ID / Username');
      return;
    }
    if (!pin.trim()) {
      setError('Please enter your Security PIN');
      return;
    }

    if (isRegister) {
      if (!displayName.trim()) {
        setError('Please enter your Display Name');
        return;
      }
      if (pin !== confirmPin) {
        setError('Security PINs do not match');
        return;
      }
    }

    setLoading(true);

    try {
      const result = await api.authenticate({
        username: username.trim(),
        pin: pin.trim(),
        displayName: displayName.trim(),
        isRegistration: isRegister,
      });

      setLoading(false);
      if (result.success && result.user) {
        onSuccess(result.user);
      } else {
        setError(result.error || 'Authentication failed');
      }
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Connection error to server 80.201.130.248');
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      width: '100vw',
      backgroundColor: 'var(--bg-app)',
      padding: '20px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-medium)',
        borderRadius: '16px',
        padding: '36px 32px',
        boxShadow: 'var(--shadow-lg)',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ display: 'inline-flex', marginBottom: '14px' }}>
            <ImpulsLogo size={48} />
          </div>
          <h1 style={{
            fontSize: '20px',
            fontWeight: 600,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
            marginBottom: '6px',
          }}>
            {isRegister ? 'Create Impuls Account' : 'Impuls Private Messenger'}
          </h1>
          <p style={{
            fontSize: '13px',
            color: 'var(--text-muted)',
            lineHeight: 1.4,
          }}>
            {isRegister
              ? 'Register your private credentials on your self-hosted server.'
              : 'Enter your ID and Security PIN to access your workspace.'}
          </p>
        </div>

        {/* Server Connection Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          padding: '6px 12px',
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '8px',
          fontSize: '11px',
          color: 'var(--text-secondary)',
          marginBottom: '24px',
          fontFamily: 'var(--font-mono)',
        }}>
          <span style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: 'var(--status-online)',
          }} />
          Server: 80.201.130.248 (Port 20443)
        </div>

        {error && (
          <div style={{
            padding: '10px 14px',
            backgroundColor: 'rgba(235, 87, 87, 0.1)',
            border: '1px solid rgba(235, 87, 87, 0.25)',
            borderRadius: '8px',
            color: '#eb5757',
            fontSize: '12px',
            marginBottom: '18px',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Username / ID */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: 500,
              color: 'var(--text-secondary)',
              marginBottom: '6px',
            }}>
              Impuls ID or Username
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'var(--bg-input)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '0 12px',
            }}>
              <UserIcon size={16} color="var(--text-muted)" />
              <input
                type="text"
                placeholder="e.g. mahan"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 10px',
                  backgroundColor: 'transparent',
                  color: 'var(--text-primary)',
                  fontSize: '14px',
                }}
              />
            </div>
          </div>

          {/* Display Name (if Register) */}
          {isRegister && (
            <div>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: 500,
                color: 'var(--text-secondary)',
                marginBottom: '6px',
              }}>
                Display Name
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '0 12px',
              }}>
                <CheckCircle2 size={16} color="var(--text-muted)" />
                <input
                  type="text"
                  placeholder="e.g. Mahan"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 10px',
                    backgroundColor: 'transparent',
                    color: 'var(--text-primary)',
                    fontSize: '14px',
                  }}
                />
              </div>
            </div>
          )}

          {/* Security PIN / Password */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: 500,
              color: 'var(--text-secondary)',
              marginBottom: '6px',
            }}>
              Security PIN / Password
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'var(--bg-input)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '0 12px',
            }}>
              <Lock size={16} color="var(--text-muted)" />
              <input
                type="password"
                placeholder="••••••"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 10px',
                  backgroundColor: 'transparent',
                  color: 'var(--text-primary)',
                  fontSize: '14px',
                }}
              />
            </div>
          </div>

          {/* Confirm PIN (if Register) */}
          {isRegister && (
            <div>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: 500,
                color: 'var(--text-secondary)',
                marginBottom: '6px',
              }}>
                Confirm Security PIN
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '0 12px',
              }}>
                <Shield size={16} color="var(--text-muted)" />
                <input
                  type="password"
                  placeholder="••••••"
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 10px',
                    backgroundColor: 'transparent',
                    color: 'var(--text-primary)',
                    fontSize: '14px',
                  }}
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px',
              backgroundColor: 'var(--accent-base)',
              border: '1px solid var(--border-medium)',
              borderRadius: '8px',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 500,
              transition: 'background-color 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--accent-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--accent-base)')}
          >
            {loading ? 'Authenticating...' : (isRegister ? 'Register & Enter' : 'Sign In')}
            {!loading && <ArrowRight size={16} />}
          </button>
        </form>

        {/* Toggle Mode */}
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
            style={{
              fontSize: '13px',
              color: 'var(--text-secondary)',
              textDecoration: 'underline',
              cursor: 'pointer',
            }}
          >
            {isRegister ? 'Already registered? Sign In' : 'Need an account? Register here'}
          </button>
        </div>
      </div>
    </div>
  );
};
