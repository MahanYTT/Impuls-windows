import { User, Chat, Message } from '../types';

const STORAGE_KEY_USER = 'impuls_active_user';
const STORAGE_KEY_CHATS = 'impuls_chats';
const STORAGE_KEY_MESSAGES = 'impuls_messages';
const STORAGE_KEY_FRIENDS = 'impuls_friends';

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

    // Default Seed with Impuls System, Group, and Channel
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
        id: 'chat_group_core',
        title: 'Impuls Core Team',
        type: 'group',
        username: 'impuls_core',
        avatarColor: '#2ea6ff',
        description: 'Private encrypted team room on 80.201.130.248',
        lastMessage: 'Encryption keys verified across all nodes.',
        lastMessageTime: Date.now() - 1800000,
        unreadCount: 1,
        members: ['system', 'mahan', 'schmitz', 'alex'],
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

  getFriends: (): User[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY_FRIENDS);
      if (data) return JSON.parse(data);
    } catch {}

    const defaultFriends: User[] = [
      {
        id: 'u_mahan',
        username: 'mahan',
        displayName: 'Mahan YTT',
        isOnline: true,
        isPremium: true,
        bio: 'Impuls Founder & Lead Architect',
        customStatus: '⚡ Building private networks',
      },
      {
        id: 'u_alex',
        username: 'alex',
        displayName: 'Alex Rivers',
        isOnline: true,
        isPremium: true,
        bio: 'Core Infrastructure Specialist',
        customStatus: '🛡️ MTProto 2.0 active',
      },
      {
        id: 'u_schmitz',
        username: 'schmitz',
        displayName: 'Manuel Schmitz',
        isOnline: false,
        isPremium: true,
        bio: 'Desktop Client Engineer',
        customStatus: '🌙 Offline (Last seen 2h ago)',
      }
    ];
    localStorage.setItem(STORAGE_KEY_FRIENDS, JSON.stringify(defaultFriends));
    return defaultFriends;
  },

  saveFriends: (friends: User[]) => {
    localStorage.setItem(STORAGE_KEY_FRIENDS, JSON.stringify(friends));
  },

  addFriend: (friend: User) => {
    const friends = storage.getFriends();
    if (!friends.some(f => f.username.toLowerCase() === friend.username.toLowerCase())) {
      const updated = [friend, ...friends];
      storage.saveFriends(updated);
      return updated;
    }
    return friends;
  },

  removeFriend: (userId: string) => {
    const friends = storage.getFriends();
    const updated = friends.filter(f => f.id !== userId);
    storage.saveFriends(updated);
    return updated;
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
          reactions: { '🛡️': 1, '🔥': 2 },
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
          reactions: { '👍': 3 },
        }
      ];
      storage.saveMessages('chat_system', initialSystemMessages);
      return initialSystemMessages;
    }

    if (chatId === 'chat_group_core') {
      const initialGroupMessages: Message[] = [
        {
          id: 'msg_group_1',
          chatId: 'chat_group_core',
          senderId: 'u_mahan',
          senderName: 'Mahan YTT',
          senderColor: '#2ea6ff',
          text: 'Group room initialized with end-to-end MTProto protocol routing.',
          timestamp: Date.now() - 3600000,
          isOutgoing: false,
          isRead: true,
          reactions: { '🚀': 2 },
        },
        {
          id: 'msg_group_2',
          chatId: 'chat_group_core',
          senderId: 'u_alex',
          senderName: 'Alex Rivers',
          senderColor: '#7bc862',
          text: 'Encryption keys verified across all nodes. Real-time broadcast active.',
          timestamp: Date.now() - 1800000,
          isOutgoing: false,
          isRead: true,
          reactions: { '⚡': 2 },
        }
      ];
      storage.saveMessages('chat_group_core', initialGroupMessages);
      return initialGroupMessages;
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
    
    // Deduplicate: If message already exists by ID or content timestamp within 4s, update it
    const existingIndex = existing.findIndex(m => 
      m.id === message.id || 
      (m.senderId === message.senderId && m.text === message.text && Math.abs(m.timestamp - message.timestamp) < 4000)
    );

    let updated: Message[];
    if (existingIndex !== -1) {
      updated = [...existing];
      updated[existingIndex] = { ...updated[existingIndex], ...message };
    } else {
      updated = [...existing, message];
    }

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
  },

  toggleReaction: (chatId: string, messageId: string, emoji: string): Message[] => {
    const messages = storage.getMessages(chatId);
    const updated = messages.map(msg => {
      if (msg.id !== messageId) return msg;
      const reactions = { ...(msg.reactions || {}) };
      if (reactions[emoji]) {
        reactions[emoji] += 1;
      } else {
        reactions[emoji] = 1;
      }
      return { ...msg, reactions };
    });
    storage.saveMessages(chatId, updated);
    return updated;
  }
};

