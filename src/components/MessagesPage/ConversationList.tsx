import React from 'react';
import { User, Clock } from 'lucide-react';
import { Conversation, Message } from '../../types';
import { mockMentors, mockMentees } from '../../data/mockData';

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversationId: string | null;
  onSelectConversation: (conversationId: string) => void;
  currentUserId: string;
}

/**
 * Conversation list component showing all user conversations
 * Props:
 * - conversations: Array of conversation objects
 * - selectedConversationId: Currently selected conversation ID
 * - onSelectConversation: Function called when a conversation is selected
 * - currentUserId: Current user's ID for filtering
 */
const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedConversationId,
  onSelectConversation,
  currentUserId
}) => {
  const getOtherUser = (conversation: Conversation) => {
    const otherUserId = conversation.participants.find(id => id !== currentUserId);
    const allUsers = [...mockMentors, ...mockMentees];
    return allUsers.find(user => user.id === otherUserId);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    if (messageDate.getTime() === today.getTime()) {
      return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    } else if (messageDate.getTime() === today.getTime() - 24 * 60 * 60 * 1000) {
      return 'Dün';
    } else {
      return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
    }
  };

  const truncateMessage = (message: string, maxLength: number = 50) => {
    return message.length > maxLength ? message.substring(0, maxLength) + '...' : message;
  };

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <User className="w-16 h-16 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz mesajınız yok</h3>
        <p className="text-gray-600">Mentörlerle iletişime geçtiğinizde mesajlar burada görünecek.</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Mesajlar</h2>
      </div>
      
      <div className="divide-y divide-gray-200">
        {conversations.map((conversation) => {
          const otherUser = getOtherUser(conversation);
          const isSelected = selectedConversationId === conversation.id;
          
          if (!otherUser) return null;
          
          return (
            <button
              key={conversation.id}
              onClick={() => onSelectConversation(conversation.id)}
              className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                isSelected ? 'bg-blue-50 border-r-2 border-blue-500' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="relative">
                  <img
                    src={otherUser.avatar || `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=60`}
                    alt={otherUser.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {conversation.unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-medium">
                        {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`text-sm font-medium truncate ${
                      conversation.unreadCount > 0 ? 'text-gray-900' : 'text-gray-700'
                    }`}>
                      {otherUser.name}
                    </h3>
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{formatTime(conversation.lastMessage.timestamp)}</span>
                    </div>
                  </div>
                  
                  <p className={`text-sm truncate ${
                    conversation.unreadCount > 0 ? 'text-gray-900 font-medium' : 'text-gray-600'
                  }`}>
                    {truncateMessage(conversation.lastMessage.content)}
                  </p>
                  
                  <p className="text-xs text-blue-600 mt-1">
                    {otherUser.role === 'mentor' ? (otherUser as any).title : 'Menti'}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ConversationList;