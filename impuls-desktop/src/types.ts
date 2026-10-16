export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  isOnline: boolean;
  isPremium: boolean;
  bio?: string;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
  isOutgoing: boolean;
  isRead: boolean;
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
  type: 'dm' | 'channel' | 'system';
  username?: string;
  avatar?: string;
  lastMessage?: string;
  lastMessageTime?: number;
  unreadCount: number;
  isOnline?: boolean;
}

export type TabType = 'dm' | 'channels' | 'vault' | 'settings';

export interface AuthCredentials {
  username: string;
  pin: string;
  displayName?: string;
  isRegistration: boolean;
}
