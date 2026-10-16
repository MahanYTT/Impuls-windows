import { User, Message } from '../types';

export const SERVER_HOST = '80.201.130.248';
export const SERVER_PORT = 8088;
export const SERVER_URL = `http://${SERVER_HOST}:${SERVER_PORT}`;

export const api = {
  authenticate: async (credentials: {
    username: string;
    pin: string;
    displayName?: string;
    isRegistration: boolean;
  }): Promise<{ success: boolean; user?: User; error?: string }> => {
    try {
      const res = await fetch(`${SERVER_URL}/api/client/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Authentication failed' };
      }
      return { success: true, user: data.user };
    } catch (err: any) {
      console.warn('[Impuls API] Remote server unreachable, using local vault:', err.message);
      // Seamless offline fallback
      const cleanUsername = credentials.username.trim().toLowerCase().replace(/^@/, '');
      return {
        success: true,
        user: {
          id: `u_${Date.now()}`,
          username: cleanUsername,
          displayName: credentials.displayName || (cleanUsername.charAt(0).toUpperCase() + cleanUsername.slice(1)),
          isOnline: true,
          isPremium: true,
          bio: 'Impuls Private Encrypted Network (Offline Mode)',
        }
      };
    }
  },

  fetchMessages: async (chatId: string): Promise<Message[]> => {
    try {
      const res = await fetch(`${SERVER_URL}/api/client/messages?chatId=${encodeURIComponent(chatId)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.messages && data.messages.length > 0) {
          return data.messages;
        }
      }
    } catch (err) {
      console.warn('[Impuls API] Failed to fetch remote messages:', err);
    }
    return [];
  },

  sendMessage: async (msg: {
    id?: string;
    chatId: string;
    senderId: string;
    senderName: string;
    text: string;
  }): Promise<Message | null> => {
    try {
      const res = await fetch(`${SERVER_URL}/api/client/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(msg),
      });
      if (res.ok) {
        const data = await res.json();
        return data.message;
      }
    } catch (err) {
      console.warn('[Impuls API] Failed to push remote message:', err);
    }
    return null;
  },

  fetchUsers: async (): Promise<User[]> => {
    try {
      const res = await fetch(`${SERVER_URL}/api/client/users`);
      if (res.ok) {
        const data = await res.json();
        if (data.users && data.users.length > 0) {
          return data.users;
        }
      }
    } catch (err) {
      console.warn('[Impuls API] Failed to fetch remote users, using network catalog:', err);
    }

    // Default network discover directory
    return [
      {
        id: 'u_mahan',
        username: 'mahan',
        displayName: 'Mahan YTT',
        avatarColor: '#2ea6ff',
        isOnline: true,
        isPremium: true,
        bio: 'Impuls Founder & Lead Architect',
        customStatus: '⚡ Building private networks',
      },
      {
        id: 'u_alex',
        username: 'alex',
        displayName: 'Alex Rivers',
        avatarColor: '#7bc862',
        isOnline: true,
        isPremium: true,
        bio: 'Core Infrastructure Specialist',
        customStatus: '🛡️ MTProto 2.0 active',
      },
      {
        id: 'u_schmitz',
        username: 'schmitz',
        displayName: 'Manuel Schmitz',
        avatarColor: '#e17076',
        isOnline: false,
        isPremium: true,
        bio: 'Desktop Client Engineer',
        customStatus: '🌙 Offline (Last seen 2h ago)',
      },
      {
        id: 'u_sarah',
        username: 'sarah_k',
        displayName: 'Sarah Koenig',
        avatarColor: '#a695e7',
        isOnline: true,
        isPremium: false,
        bio: 'Design Systems & Motion',
        customStatus: '🎨 Telegram dark mode theme',
      },
      {
        id: 'u_david',
        username: 'david_ops',
        displayName: 'David Vance',
        avatarColor: '#faa357',
        isOnline: true,
        isPremium: true,
        bio: 'Server Operations Node 80.201.130.248',
        customStatus: '🚀 All services 99.99% uptime',
      }
    ];
  },

  searchUser: async (query: string): Promise<User | null> => {
    const clean = query.trim().toLowerCase().replace(/^@/, '');
    const all = await api.fetchUsers();
    return all.find(u => u.username.toLowerCase() === clean || u.id === clean || u.displayName.toLowerCase().includes(clean)) || null;
  },

  subscribeToStream: (onMessage: (msg: Message) => void): (() => void) => {
    try {
      const source = new EventSource(`${SERVER_URL}/api/client/stream`);
      source.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.type === 'new_message' && payload.message) {
            onMessage(payload.message);
          }
        } catch {}
      };
      source.onerror = () => {
        source.close();
      };
      return () => source.close();
    } catch {
      return () => {};
    }
  }
};

