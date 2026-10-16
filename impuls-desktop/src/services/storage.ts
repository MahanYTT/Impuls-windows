import { User, Chat, Message } from '../types';

const STORAGE_KEY_USER = 'impuls_active_user';
const STORAGE_KEY_CHATS = 'impuls_chats';
const STORAGE_KEY_MESSAGES = 'impuls_messages';

export const storage = {
  getUser: (): User | null => {
    try {
      const data = localStorage.getItem(STORAGE_KEY_USER);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  setUser: (user: User | null) => {
    if (user) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY_USER);
    }
  },

  getChats: (): Chat[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY_CHATS);
      if (data) return JSON.parse(data);
    } catch {}

    // Default Seed with Impuls System
    const defaultChats: Chat[] = [
      {
        id: 'chat_system',
        title: 'Impuls System',
        type: 'system',
        username: 'system',
        lastMessage: 'Welcome to your private encrypted network.',
        lastMessageTime: Date.now(),
        unreadCount: 0,
        isOnline: true,
      },
      {
        id: 'chat_private_channel',
        title: 'Main Channel',
        type: 'channel',
        username: 'main',
        lastMessage: 'Impuls Gateway operational on 80.201.130.248.',
        lastMessageTime: Date.now() - 3600000,
        unreadCount: 0,
      }
    ];
    localStorage.setItem(STORAGE_KEY_CHATS, JSON.stringify(defaultChats));
    return defaultChats;
  },

  saveChats: (chats: Chat[]) => {
    localStorage.setItem(STORAGE_KEY_CHATS, JSON.stringify(chats));
  },

  getMessages: (chatId: string): Message[] => {
    try {
      const all = localStorage.getItem(STORAGE_KEY_MESSAGES);
      const map: Record<string, Message[]> = all ? JSON.parse(all) : {};
      if (map[chatId]) return map[chatId];
    } catch {}

    if (chatId === 'chat_system') {
      const initialSystemMessages: Message[] = [
        {
          id: 'msg_welcome_1',
          chatId: 'chat_system',
          senderId: 'system',
          senderName: 'Impuls System',
          text: 'Welcome to Impuls Private Network. Your messaging environment is hosted on your private server infrastructure at 80.201.130.248.',
          timestamp: Date.now() - 60000,
          isOutgoing: false,
          isRead: true,
        },
        {
          id: 'msg_welcome_2',
          chatId: 'chat_system',
          senderId: 'system',
          senderName: 'Impuls System',
          text: 'Security verification completed: MTProto 2.0 encryption active, local storage persistent, Pro privileges granted.',
          timestamp: Date.now(),
          isOutgoing: false,
          isRead: true,
        }
      ];
      storage.saveMessages('chat_system', initialSystemMessages);
      return initialSystemMessages;
    }

    return [];
  },

  saveMessages: (chatId: string, messages: Message[]) => {
    try {
      const all = localStorage.getItem(STORAGE_KEY_MESSAGES);
      const map: Record<string, Message[]> = all ? JSON.parse(all) : {};
      map[chatId] = messages;
      localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(map));
    } catch {}
  },

  addMessage: (chatId: string, message: Message): Message[] => {
    const existing = storage.getMessages(chatId);
    const updated = [...existing, message];
    storage.saveMessages(chatId, updated);

    // Update chat last message
    const chats = storage.getChats();
    const chatIndex = chats.findIndex(c => c.id === chatId);
    if (chatIndex !== -1) {
      chats[chatIndex].lastMessage = message.text;
      chats[chatIndex].lastMessageTime = message.timestamp;
      storage.saveChats(chats);
    }

    return updated;
  }
};
