import React from 'react';
import { ImpulsLogo } from '../assets/Logo';
import { TabType, User } from '../types';
import { MessageSquare, Hash, FolderArchive, Settings, LogOut, ShieldCheck, Users, UserPlus } from 'lucide-react';


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
          className="telegram-press"
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: currentTab === 'dm' ? 'var(--bg-card-hover)' : 'transparent',
            color: currentTab === 'dm' ? 'var(--accent-telegram)' : 'var(--text-muted)',
            boxShadow: currentTab === 'dm' ? 'inset 0 0 0 1px rgba(46, 166, 255, 0.25)' : 'none',
          }}
        >
          <MessageSquare size={20} />
        </button>

        <button
          title="WhatsApp-Style Groups"
          onClick={() => onTabChange('groups')}
          className="telegram-press"
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: currentTab === 'groups' ? 'var(--bg-card-hover)' : 'transparent',
            color: currentTab === 'groups' ? 'var(--accent-telegram)' : 'var(--text-muted)',
            boxShadow: currentTab === 'groups' ? 'inset 0 0 0 1px rgba(46, 166, 255, 0.25)' : 'none',
          }}
        >
          <Users size={20} />
        </button>

        <button
          title="Discord-Style Friends & Network Discovery"
          onClick={() => onTabChange('friends')}
          className="telegram-press"
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: currentTab === 'friends' ? 'var(--bg-card-hover)' : 'transparent',
            color: currentTab === 'friends' ? 'var(--accent-discord-green)' : 'var(--text-muted)',
            boxShadow: currentTab === 'friends' ? 'inset 0 0 0 1px rgba(35, 165, 90, 0.3)' : 'none',
          }}
        >
          <UserPlus size={20} />
        </button>

        <button
          title="Public & Encrypted Channels"
          onClick={() => onTabChange('channels')}
          className="telegram-press"
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: currentTab === 'channels' ? 'var(--bg-card-hover)' : 'transparent',
            color: currentTab === 'channels' ? 'var(--accent-telegram)' : 'var(--text-muted)',
            boxShadow: currentTab === 'channels' ? 'inset 0 0 0 1px rgba(46, 166, 255, 0.25)' : 'none',
          }}
        >
          <Hash size={20} />
        </button>

        <button
          title="Files & Media Vault"
          onClick={() => onTabChange('vault')}
          className="telegram-press"
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: currentTab === 'vault' ? 'var(--bg-card-hover)' : 'transparent',
            color: currentTab === 'vault' ? 'var(--text-primary)' : 'var(--text-muted)',
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
