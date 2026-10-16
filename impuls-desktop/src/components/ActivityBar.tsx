import React from 'react';
import { ImpulsLogo } from '../assets/Logo';
import { TabType, User } from '../types';
import { MessageSquare, Hash, FolderArchive, Settings, LogOut, Users, UserPlus } from 'lucide-react';

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
      {/* Top Section: Brand Logo + Primary Tabs */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: '8px' }}>
        {/* Brand Mark */}
        <div style={{ marginBottom: '8px' }}>
          <ImpulsLogo size={32} />
        </div>

        {/* Chats / Direct Messages */}
        <button
          title="Chats"
          onClick={() => onTabChange('dm')}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: currentTab === 'dm' ? 'rgba(0, 168, 132, 0.16)' : 'transparent',
            color: currentTab === 'dm' ? 'var(--accent-whatsapp)' : 'var(--text-muted)',
            borderLeft: currentTab === 'dm' ? '3px solid var(--accent-whatsapp)' : '3px solid transparent',
            transition: 'all 0.12s ease',
          }}
        >
          <MessageSquare size={20} />
        </button>

        {/* WhatsApp Groups */}
        <button
          title="Groups"
          onClick={() => onTabChange('groups')}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: currentTab === 'groups' ? 'rgba(0, 168, 132, 0.16)' : 'transparent',
            color: currentTab === 'groups' ? 'var(--accent-whatsapp)' : 'var(--text-muted)',
            borderLeft: currentTab === 'groups' ? '3px solid var(--accent-whatsapp)' : '3px solid transparent',
            transition: 'all 0.12s ease',
          }}
        >
          <Users size={20} />
        </button>

        {/* Friends & Contacts */}
        <button
          title="Contacts & Directory"
          onClick={() => onTabChange('friends')}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: currentTab === 'friends' ? 'rgba(0, 168, 132, 0.16)' : 'transparent',
            color: currentTab === 'friends' ? 'var(--accent-whatsapp)' : 'var(--text-muted)',
            borderLeft: currentTab === 'friends' ? '3px solid var(--accent-whatsapp)' : '3px solid transparent',
            transition: 'all 0.12s ease',
          }}
        >
          <UserPlus size={20} />
        </button>

        {/* Channels */}
        <button
          title="Channels & Broadcasts"
          onClick={() => onTabChange('channels')}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: currentTab === 'channels' ? 'rgba(0, 168, 132, 0.16)' : 'transparent',
            color: currentTab === 'channels' ? 'var(--accent-whatsapp)' : 'var(--text-muted)',
            borderLeft: currentTab === 'channels' ? '3px solid var(--accent-whatsapp)' : '3px solid transparent',
            transition: 'all 0.12s ease',
          }}
        >
          <Hash size={20} />
        </button>

        {/* Media Vault */}
        <button
          title="Encrypted Files & Media Vault"
          onClick={() => onTabChange('vault')}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: currentTab === 'vault' ? 'rgba(0, 168, 132, 0.16)' : 'transparent',
            color: currentTab === 'vault' ? 'var(--accent-whatsapp)' : 'var(--text-muted)',
            borderLeft: currentTab === 'vault' ? '3px solid var(--accent-whatsapp)' : '3px solid transparent',
            transition: 'all 0.12s ease',
          }}
        >
          <FolderArchive size={20} />
        </button>
      </div>

      {/* Bottom Section: Settings + Logout + Profile Avatar */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: '8px' }}>
        <button
          title="Settings & Encryption"
          onClick={onOpenSettings}
          style={{
            width: '38px',
            height: '38px',
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
          title="Log Out"
          onClick={onLogout}
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)',
          }}
        >
          <LogOut size={18} />
        </button>

        {/* User Profile Avatar with Status Dot (Properly fitted without overflow) */}
        <div
          title={`${user.displayName} (@${user.username})`}
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            backgroundColor: 'var(--accent-whatsapp-dark)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 600,
            fontSize: '13px',
            position: 'relative',
            cursor: 'pointer',
            marginTop: '4px',
          }}
          onClick={onOpenSettings}
        >
          {user.displayName.charAt(0).toUpperCase()}
          <span
            style={{
              position: 'absolute',
              bottom: '0px',
              right: '0px',
              width: '9px',
              height: '9px',
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
