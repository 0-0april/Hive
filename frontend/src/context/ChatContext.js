import React, { createContext, useState, useEffect, useContext } from 'react';
import { saveMockData, getMockData } from '../utils/storage';
import { generateInitialConversations, generateId } from '../mock/data';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load conversations from storage
  useEffect(() => {
    if (currentUser) {
      loadConversations();
    }
  }, [currentUser]);

  const loadConversations = async () => {
    try {
      const data = await getMockData();
      if (data && data.conversations) {
        setConversations(data.conversations);
      } else {
        // Initialize with sample conversations
        const initial = generateInitialConversations(currentUser.id);
        setConversations(initial);
        await saveMockData({ conversations: initial });
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  // Save conversations to storage
  const saveConversations = async (updatedConversations) => {
    try {
      await saveMockData({ conversations: updatedConversations });
      setConversations(updatedConversations);
    } catch (error) {
      console.error('Error saving conversations:', error);
    }
  };

  // Get conversation by ID
  const getConversation = (conversationId) => {
    return conversations.find((c) => c.id === conversationId);
  };

  // Start or get private chat
  const startPrivateChat = async (otherUserId) => {
    try {
      // Check if conversation already exists
      const existing = conversations.find(
        (c) =>
          c.type === 'private' &&
          c.participants.includes(currentUser.id) &&
          c.participants.includes(otherUserId)
      );

      if (existing) {
        return { success: true, conversationId: existing.id };
      }

      // Create new conversation
      const newConversation = {
        id: generateId(),
        type: 'private',
        participants: [currentUser.id, otherUserId],
        lastMessage: '',
        updatedAt: Date.now(),
        messages: [],
      };

      const updated = [...conversations, newConversation];
      await saveConversations(updated);

      return { success: true, conversationId: newConversation.id };
    } catch (error) {
      return { success: false, message: 'Failed to start chat' };
    }
  };

  // Create group chat
  const createGroup = async (name, participantIds) => {
    try {
      if (participantIds.length < 2) {
        return { success: false, message: 'Group must have at least 3 members' };
      }

      const newConversation = {
        id: generateId(),
        type: 'group',
        name,
        participants: [currentUser.id, ...participantIds],
        lastMessage: '',
        updatedAt: Date.now(),
        messages: [],
      };

      const updated = [...conversations, newConversation];
      await saveConversations(updated);

      return { success: true, conversationId: newConversation.id };
    } catch (error) {
      return { success: false, message: 'Failed to create group' };
    }
  };

  // Add message
  const addMessage = async (conversationId, text, replyToId = null) => {
    try {
      const conversation = conversations.find((c) => c.id === conversationId);
      if (!conversation) {
        return { success: false, message: 'Conversation not found' };
      }

      const newMessage = {
        id: generateId(),
        conversationId,
        senderId: currentUser.id,
        text,
        createdAt: Date.now(),
        replyToId,
        reactions: {},
      };

      const updatedConversation = {
        ...conversation,
        messages: [...conversation.messages, newMessage],
        lastMessage: text,
        updatedAt: Date.now(),
      };

      const updated = conversations.map((c) =>
        c.id === conversationId ? updatedConversation : c
      );

      await saveConversations(updated);

      return { success: true, message: newMessage };
    } catch (error) {
      return { success: false, message: 'Failed to send message' };
    }
  };

  // Add reaction to message
  const addReaction = async (conversationId, messageId, emoji) => {
    try {
      const conversation = conversations.find((c) => c.id === conversationId);
      if (!conversation) {
        return { success: false };
      }

      const updatedMessages = conversation.messages.map((msg) => {
        if (msg.id === messageId) {
          const reactions = { ...msg.reactions };
          
          // If user already reacted with this emoji, remove it
          if (reactions[currentUser.id] === emoji) {
            delete reactions[currentUser.id];
          } else {
            // Otherwise, add/update reaction
            reactions[currentUser.id] = emoji;
          }

          return { ...msg, reactions };
        }
        return msg;
      });

      const updatedConversation = {
        ...conversation,
        messages: updatedMessages,
      };

      const updated = conversations.map((c) =>
        c.id === conversationId ? updatedConversation : c
      );

      await saveConversations(updated);

      return { success: true };
    } catch (error) {
      return { success: false };
    }
  };

  // Get sorted conversations (by last message time)
  const getSortedConversations = () => {
    return [...conversations].sort((a, b) => b.updatedAt - a.updatedAt);
  };

  const value = {
    conversations,
    loading,
    getConversation,
    startPrivateChat,
    createGroup,
    addMessage,
    addReaction,
    getSortedConversations,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within ChatProvider');
  }
  return context;
};
