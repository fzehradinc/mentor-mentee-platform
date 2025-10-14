import React, { useState, useMemo } from 'react';
import { ArrowLeft, MessageSquare, Bell } from 'lucide-react';
import Layout from '../components/Layout/Layout';
import ConversationList from '../components/MessagesPage/ConversationList';
import ChatWindow from '../components/MessagesPage/ChatWindow';
import NotificationsList from '../components/MessagesPage/NotificationsList';
import { useAuth } from '../contexts/AuthContext';
import { mockMessages, mockNotifications } from '../data/mockData';
import { Message, Conversation, Notification } from '../types';

type TabType = 'messages' | 'notifications';

interface MessagesPageProps {
  onBack: () => void;
}

/**
 * Messages page component for managing conversations and notifications
 * Props:
 * - onBack: Function to navigate back to home page
 */
const MessagesPage: React.FC<MessagesPageProps> = ({ onBack }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('messages');
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

  // Group messages into conversations
  const conversations = useMemo(() => {
    if (!user) return [];

    const conversationMap = new Map<string, Conversation>();
    
    mockMessages
      .filter(message => message.senderId === user.id || message.receiverId === user.id)
      .forEach(message => {
        const otherUserId = message.senderId === user.id ? message.receiverId : message.senderId;
        const conversationId = [user.id, otherUserId].sort().join('-');
        
        if (!conversationMap.has(conversationId)) {
          conversationMap.set(conversationId, {
            id: conversationId,
            participants: [user.id, otherUserId],
            lastMessage: message,
            unreadCount: 0,
            updatedAt: message.timestamp
          });
        }
        
        const conversation = conversationMap.get(conversationId)!;
        
        // Update last message if this message is newer
        if (new Date(message.timestamp) > new Date(conversation.lastMessage.timestamp)) {
          conversation.lastMessage = message;
          conversation.updatedAt = message.timestamp;
        }
        
        // Count unread messages
        if (!message.isRead && message.senderId !== user.id) {
          conversation.unreadCount++;
        }
      });
    
    return Array.from(conversationMap.values())
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [user]);

  // Get messages for selected conversation
  const selectedConversationMessages = useMemo(() => {
    if (!selectedConversationId || !user) return [];
    
    const conversation = conversations.find(c => c.id === selectedConversationId);
    if (!conversation) return [];
    
    return mockMessages
      .filter(message => 
        conversation.participants.includes(message.senderId) && 
        conversation.participants.includes(message.receiverId)
      )
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [selectedConversationId, conversations, user]);

  // Get user notifications
  const userNotifications = useMemo(() => {
    if (!user) return [];
    return mockNotifications
      .filter(notification => notification.userId === user.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [user]);

  const handleSendMessage = (content: string) => {
    // In a real app, this would send the message to the API
    console.log('Sending message:', content);
    alert('Mesaj gönderildi! (Demo)');
  };

  const handleMarkAsRead = (notificationId: string) => {
    // In a real app, this would mark the notification as read
    console.log('Marking notification as read:', notificationId);
  };

  const handleMarkAllAsRead = () => {
    // In a real app, this would mark all notifications as read
    console.log('Marking all notifications as read');
  };

  const handleNotificationClick = (notification: Notification) => {
    // In a real app, this would navigate to the relevant page
    console.log('Notification clicked:', notification);
    if (notification.actionUrl) {
      // Navigate to the action URL
      alert(`Yönlendiriliyor: ${notification.actionUrl} (Demo)`);
    }
  };

  if (!user) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Mesajlarınızı görüntülemek için giriş yapın
            </h1>
          </div>
        </div>
      </Layout>
    );
  }

  const unreadMessagesCount = conversations.reduce((total, conv) => total + conv.unreadCount, 0);
  const unreadNotificationsCount = userNotifications.filter(n => !n.isRead).length;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Ana sayfaya dön</span>
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Mesajlar & Bildirimler</h1>
          
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('messages')}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center space-x-2 ${
                  activeTab === 'messages'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Mesajlar</span>
                {unreadMessagesCount > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {unreadMessagesCount}
                  </span>
                )}
              </button>
              
              <button
                onClick={() => setActiveTab('notifications')}
                className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center space-x-2 ${
                  activeTab === 'notifications'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Bell className="w-4 h-4" />
                <span>Bildirimler</span>
                {unreadNotificationsCount > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-[600px] overflow-hidden">
          {activeTab === 'messages' ? (
            <div className="flex h-full">
              {/* Conversations List */}
              <div className="w-1/3 border-r border-gray-200">
                <ConversationList
                  conversations={conversations}
                  selectedConversationId={selectedConversationId}
                  onSelectConversation={setSelectedConversationId}
                  currentUserId={user.id}
                />
              </div>
              
              {/* Chat Window */}
              <div className="flex-1">
                <ChatWindow
                  conversationId={selectedConversationId || ''}
                  messages={selectedConversationMessages}
                  currentUserId={user.id}
                  onSendMessage={handleSendMessage}
                />
              </div>
            </div>
          ) : (
            <NotificationsList
              notifications={userNotifications}
              onMarkAsRead={handleMarkAsRead}
              onMarkAllAsRead={handleMarkAllAsRead}
              onNotificationClick={handleNotificationClick}
            />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MessagesPage;