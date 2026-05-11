import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'react-native-get-random-values';

// Mock users
export const initialMockUsers = [
  { 
    id: 'u1', 
    fullName: 'Emma Watson', 
    username: 'emma_w', 
    email: 'emma@hive.com', 
    password: '123' 
  },
  { 
    id: 'u2', 
    fullName: 'Olivia Chen', 
    username: 'olivia_c', 
    email: 'olivia@hive.com', 
    password: '123' 
  },
  { 
    id: 'u3', 
    fullName: 'Sophia Rossi', 
    username: 'sophia_r', 
    email: 'sophia@hive.com', 
    password: '123' 
  },
  { 
    id: 'u4', 
    fullName: 'Mia Kim', 
    username: 'mia_k', 
    email: 'mia@hive.com', 
    password: '123' 
  },
];

// Generate initial conversations with sample messages
export const generateInitialConversations = (currentUserId) => {
  const now = Date.now();
  
  return [
    {
      id: 'c1',
      type: 'private',
      participants: [currentUserId, 'u2'],
      lastMessage: 'Hey! How are you?',
      updatedAt: now - 3600000, // 1 hour ago
      messages: [
        {
          id: 'm1',
          conversationId: 'c1',
          senderId: 'u2',
          text: 'Hey! How are you?',
          createdAt: now - 3600000,
          reactions: {},
        },
      ],
    },
    {
      id: 'c2',
      type: 'private',
      participants: [currentUserId, 'u3'],
      lastMessage: 'See you tomorrow!',
      updatedAt: now - 7200000, // 2 hours ago
      messages: [
        {
          id: 'm2',
          conversationId: 'c2',
          senderId: currentUserId,
          text: 'Want to grab coffee?',
          createdAt: now - 7300000,
          reactions: {},
        },
        {
          id: 'm3',
          conversationId: 'c2',
          senderId: 'u3',
          text: 'Sure! What time?',
          createdAt: now - 7250000,
          reactions: { [currentUserId]: '❤️' },
        },
        {
          id: 'm4',
          conversationId: 'c2',
          senderId: currentUserId,
          text: 'How about 3pm?',
          createdAt: now - 7220000,
          reactions: {},
        },
        {
          id: 'm5',
          conversationId: 'c2',
          senderId: 'u3',
          text: 'See you tomorrow!',
          createdAt: now - 7200000,
          reactions: { [currentUserId]: '👍' },
        },
      ],
    },
  ];
};

// Helper to generate unique IDs
export const generateId = () => {
  return `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
