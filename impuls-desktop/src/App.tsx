import React, { useState, useEffect } from 'react';
import { User, Chat, Message, TabType } from './types';
import { storage } from './services/storage';
import { api } from './services/api';
import { AuthCard } from './components/AuthCard';
import { ActivityBar } from './components/ActivityBar';
import { ChatList } from './components/ChatList';
import { ChatView } from './components/ChatView';
import { SettingsModal } from './components/SettingsModal';
import { TitleBar } from './components/TitleBar';
import { FriendsView } from './components/FriendsView';
import { NewGroupModal } from './components/NewGroupModal';

export const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentTab, setCurrentTab] = useState<TabType>('dm');
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [showNewGroupModal, setShowNewGroupModal] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    // Listen for window maximization changes
    if (window.electronAPI) {
      window.electronAPI.isMaximized().then(setIsMaximized);
      const unsubscribe = window.electronAPI.onMaximizedChange((max) => {
        setIsMaximized(max);
      });
      return () => {
        if (unsubscribe) unsubscribe();
      };
    }
  }, []);

  useEffect(() => {
    const user = storage.getUser();
    if (user) {
      setCurrentUser(user);
    }
    const loadedChats = storage.getChats();
    setChats(loadedChats);
    if (loadedChats.length > 0) {
      const firstId = loadedChats[0].id;
      setActiveChatId(firstId);
      setMessages(storage.getMessages(firstId));

      // Fetch live messages from server
      api.fetchMessages(firstId).then(remote => {
        if (remote && remote.length > 0) {
          setMessages(remote);
          storage.saveMessages(firstId, remote);
        }
      });
    }

    // Subscribe to live SSE events from server
    const unsubscribe = api.subscribeToStream((incomingMsg) => {
      setMessages(prev => {
        if (prev.some(m => m.id === incomingMsg.id)) return prev;
        return [...prev, incomingMsg];
      });
    });

    return () => unsubscribe();
  }, []);

  const handleAuthSuccess = (user: User) => {
    storage.setUser(user);
    setCurrentUser(user);

    const loadedChats = storage.getChats();
    setChats(loadedChats);
    if (loadedChats.length > 0) {
      setActiveChatId(loadedChats[0].id);
      setMessages(storage.getMessages(loadedChats[0].id));
    }
  };

  const handleLogout = () => {
    storage.setUser(null);
    setCurrentUser(null);
    setActiveChatId(null);
    setMessages([]);
  };

  const handleSelectChat = async (chatId: string) => {
    setActiveChatId(chatId);
    setMessages(storage.getMessages(chatId));

    // Clear unread count on selection
    setChats(prev => prev.map(c => c.id === chatId ? { ...c, unreadCount: 0 } : c));

    // Sync with remote server
    const remote = await api.fetchMessages(chatId);
    if (remote && remote.length > 0) {
      setMessages(remote);
      storage.saveMessages(chatId, remote);
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!activeChatId || !currentUser) return;

    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      chatId: activeChatId,
      senderId: currentUser.id,
      senderName: currentUser.displayName,
      text,
      timestamp: Date.now(),
      isOutgoing: true,
      isRead: true,
      reactions: {},
    };

    // Update local state immediately
    const updated = storage.addMessage(activeChatId, newMessage);
    setMessages(updated);
    setChats(storage.getChats());

    // Push to server MongoDB database
    api.sendMessage({
      chatId: activeChatId,
      senderId: currentUser.id,
      senderName: currentUser.displayName,
      text,
    });

    // If talking to Impuls System, simulate automatic operational reply
    if (activeChatId === 'chat_system') {
      setTimeout(() => {
        const replyMsg: Message = {
          id: `msg_sys_${Date.now()}`,
          chatId: 'chat_system',
          senderId: 'system',
          senderName: 'Impuls System',
          text: `Acknowledged: "${text}". Command routed securely through 80.201.130.248.`,
          timestamp: Date.now(),
          isOutgoing: false,
          isRead: true,
          reactions: { '⚡': 1 },
        };
        const withReply = storage.addMessage('chat_system', replyMsg);
        setMessages(withReply);
        setChats(storage.getChats());
      }, 700);
    }
  };

  const handleNewChat = (title: string, username: string) => {
    const isChannel = currentTab === 'channels';
    const newChat: Chat = {
      id: `chat_${Date.now()}`,
      title,
      type: isChannel ? 'channel' : 'dm',
      username,
      lastMessage: 'Conversation initiated',
      lastMessageTime: Date.now(),
      unreadCount: 0,
      isOnline: true,
    };

    const updatedChats = [newChat, ...chats];
    storage.saveChats(updatedChats);
    setChats(updatedChats);
    handleSelectChat(newChat.id);
  };

  const handleGroupCreated = (group: Chat) => {
    const updatedChats = [group, ...chats];
    storage.saveChats(updatedChats);
    setChats(updatedChats);
    setCurrentTab('groups');
    handleSelectChat(group.id);
  };

  const handleStartDirectMessage = (targetUser: User) => {
    const existing = chats.find(c =>
      c.type === 'dm' &&
      (c.username?.toLowerCase() === targetUser.username.toLowerCase() || c.id === `chat_dm_${targetUser.id}`)
    );

    if (existing) {
      setCurrentTab('dm');
      handleSelectChat(existing.id);
    } else {
      const newDm: Chat = {
        id: `chat_dm_${targetUser.id}`,
        title: targetUser.displayName,
        type: 'dm',
        username: targetUser.username,
        avatarColor: targetUser.avatarColor,
        lastMessage: 'Direct encrypted channel opened',
        lastMessageTime: Date.now(),
        unreadCount: 0,
        isOnline: targetUser.isOnline,
      };

      const updated = [newDm, ...chats];
      storage.saveChats(updated);
      setChats(updated);
      setCurrentTab('dm');
      handleSelectChat(newDm.id);
    }
  };

  const handleUpdateUser = (updated: User) => {
    storage.setUser(updated);
    setCurrentUser(updated);
  };

  if (!currentUser) {
    return (
      <div className={`telegram-window-frame ${isMaximized ? 'maximized' : ''}`}>
        <TitleBar serverHost="80.201.130.248" isOnline={true} />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <AuthCard onSuccess={handleAuthSuccess} />
        </div>
      </div>
    );
  }

  const activeChat = chats.find(c => c.id === activeChatId) || null;

  return (
    <div className={`telegram-window-frame ${isMaximized ? 'maximized' : ''}`}>
      {/* Telegram-style Top TitleBar */}
      <TitleBar serverHost="80.201.130.248" isOnline={true} />

      {/* Main App Container */}
      <div className={`app-container ${activeChatId ? 'has-active-chat' : ''}`}>
        {/* Zone 1: Far-Left Activity Rail */}
        <ActivityBar
          currentTab={currentTab}
          onTabChange={(tab) => {
            if (tab === 'settings') {
              setShowSettings(true);
            } else {
              setCurrentTab(tab);
            }
          }}
          user={currentUser}
          onOpenSettings={() => setShowSettings(true)}
          onLogout={handleLogout}
        />

        {/* Discord-style Friends View */}
        {currentTab === 'friends' ? (
          <FriendsView
            currentUser={currentUser}
            onStartDirectMessage={handleStartDirectMessage}
          />
        ) : (
          <>
            {/* Zone 2: Middle Conversations & Groups List */}
            <ChatList
              chats={chats}
              activeChatId={activeChatId}
              onSelectChat={handleSelectChat}
              onNewChat={handleNewChat}
              onOpenNewGroup={() => setShowNewGroupModal(true)}
              currentTab={currentTab}
            />

            {/* Zone 3: Main Telegram-style Chat Pane */}
            <ChatView
              chat={activeChat}
              messages={messages}
              currentUser={currentUser}
              onSendMessage={handleSendMessage}
              onBack={() => setActiveChatId(null)}
            />
          </>
        )}

        {/* WhatsApp-Style New Group Modal */}
        {showNewGroupModal && (
          <NewGroupModal
            currentUser={currentUser}
            onClose={() => setShowNewGroupModal(false)}
            onGroupCreated={handleGroupCreated}
          />
        )}

        {/* Settings & Profile Modal */}
        {showSettings && (
          <SettingsModal
            user={currentUser}
            onClose={() => setShowSettings(false)}
            onUpdateUser={handleUpdateUser}
          />
        )}
      </div>
    </div>
  );
};
