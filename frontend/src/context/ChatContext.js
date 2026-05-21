import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { API_URL } from '../config/api';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { currentUser } = useAuth();

  // Create group chat via real backend
  const createGroup = async (name, participantIds) => {
    try {
      if (participantIds.length < 2) {
        return { success: false, message: 'Group must have at least 3 members' };
      }

      const response = await axios.post(`${API_URL}/messages/chat`, {
        participantIds,
        isGroup: true,
        groupName: name,
      });

      const chat = response.data;

      return {
        success: true,
        chatId: chat.chatId,
        chatName: chat.groupName || name,
      };
    } catch (error) {
      console.error('Error creating group:', error);
      return { success: false, message: error.response?.data?.error || 'Failed to create group' };
    }
  };

  const value = {
    createGroup,
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