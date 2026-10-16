export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  avatarColor?: string;
  isOnline: boolean;
  isPremium: boolean;
  bio?: string;
  customStatus?: string;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  senderColor?: string;
  text: string;
  timestamp: number;
  isOutgoing: boolean;
  isRead: boolean;
  reactions?: Record<string, number>; // emoji -> count
  attachments?: {
    type: 'image' | 'file';
    name: string;
    url: string;
    size?: string;
  }[];
}

export interface Chat {
  id: string;
  title: string;
  type: 'dm' | 'channel' | 'group' | 'system';
  username?: string;
  avatar?: string;
  avatarColor?: string;
  lastMessage?: string;
  lastMessageTime?: number;
  unreadCount: number;
  isOnline?: boolean;
  members?: string[]; // User IDs for groups
  description?: string;
}

export type TabType = 'dm' | 'channels' | 'groups' | 'friends' | 'vault' | 'settings';

export interface AuthCredentials {
  username: string;
  pin: string;
  displayName?: string;
  isRegistration: boolean;
}

declare global {
  interface Window {
    electronAPI?: {
      platform: string;
      minimize: () => void;
      maximize: () => void;
      close: () => void;
      isMaximized: () => Promise<boolean>;
      onMaximizedChange: (callback: (isMax: boolean) => void) => () => void;
      sendNotification: (title: string, body: string) => void;
    };
  }
}

