import React from 'react';
import { ImpulsLogo } from '../assets/Logo';
import { TabType, User } from '../types';
import { MessageSquare, Hash, FolderArchive, Settings, LogOut, ShieldCheck } from 'lucide-react';

interface ActivityBarProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  user: User;
  onOpenSettings: () => void;
  onLogout: () => void;
}

export const ActivityBar: React.FC<ActivityBarProps> = ({
  currentTab,
  onTabChange,
  user,
  onOpenSettings,
  onLogout,
}) => {
  return (
    <div className="activity-bar">
      {/* Impuls Brand Mark */}
      <div style={{ marginBottom: '24px' }}>
        <ImpulsLogo size={36} />
      </div>

      {/* Navigation Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, width: '100%', alignItems: 'center' }}>
        <button
          title="Direct Messages"
          onClick={() => onTabChange('dm')}
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: currentTab === 'dm' ? 'var(--bg-card-hover)' : 'transparent',
            color: currentTab === 'dm' ? 'var(--text-primary)' : 'var(--text-muted)',
            transition: 'all 0.15s ease',
          }}
        >
          <MessageSquare size={20} />
        </button>

        <button
          title="Channels & Groups"
          onClick={() => onTabChange('channels')}
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: currentTab === 'channels' ? 'var(--bg-card-hover)' : 'transparent',
            color: currentTab === 'channels' ? 'var(--text-primary)' : 'var(--text-muted)',
            transition: 'all 0.15s ease',
          }}
        >
          <Hash size={20} />
        </button>

        <button
          title="Files & Media Vault"
          onClick={() => onTabChange('vault')}
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: currentTab === 'vault' ? 'var(--bg-card-hover)' : 'transparent',
            color: currentTab === 'vault' ? 'var(--text-primary)' : 'var(--text-muted)',
            transition: 'all 0.15s ease',
          }}
        >
          <FolderArchive size={20} />
        </button>
      </div>

      {/* Bottom Profile & Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', width: '100%' }}>
        <button
          title="Settings"
          onClick={onOpenSettings}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)',
          }}
        >
          <Settings size={18} />
        </button>

        <button
          title="Logout"
          onClick={onLogout}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)',
          }}
        >
          <LogOut size={18} />
        </button>

        {/* User Avatar with Status indicator */}
        <div
          title={`${user.displayName} (@${user.username})`}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            backgroundColor: 'var(--accent-base)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 600,
            fontSize: '13px',
            position: 'relative',
            cursor: 'pointer',
          }}
          onClick={onOpenSettings}
        >
          {user.displayName.charAt(0).toUpperCase()}
          <span
            style={{
              position: 'absolute',
              bottom: '-2px',
              right: '-2px',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: 'var(--status-online)',
              border: '2px solid var(--bg-activity)',
            }}
          />
        </div>
      </div>
    </div>
  );
};
