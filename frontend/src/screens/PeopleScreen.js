import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { colors, spacing, borderRadius, fontSize } from '../utils/theme';
import { useFocusEffect } from '@react-navigation/native';
import { API_URL } from '../config/api';

const PeopleScreen = ({ navigation }) => {
  const { currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [conversationUsers, setConversationUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      fetchConversationUsers();
    }, [])
  );

  // Fetch users with existing conversations (Requirement 7)
  const fetchConversationUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/users/conversations`);
      setConversationUsers(response.data);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching conversation users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Search users by username (Requirement 8)
  const searchUsers = async (query) => {
    if (!query.trim()) {
      setUsers(conversationUsers);
      return;
    }

    setSearching(true);
    try {
      const response = await axios.get(`${API_URL}/users/search`, {
        params: { query: query.trim() }
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setSearching(false);
    }
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      searchUsers(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleStartChat = async (userId) => {
    if (!currentUser) return;
    
    try {
      // Create or get existing chat
      const response = await axios.post(`${API_URL}/messages/chat`, {
        participantIds: [userId],
        isGroup: false
      });

      const chat = response.data;
      
      navigation.navigate('Chat', {
        chatId: chat.chatId,
        chatName: chat.participants.find(p => p._id !== currentUser._id)?.fullName || 'Chat',
        isGroup: false
      });
    } catch (error) {
      console.error('Error starting chat:', error);
    }
  };

  const renderUser = ({ item }) => (
    <View style={styles.userItem}>
      <View style={styles.avatarContainer}>
        <Ionicons name="person" size={30} color={colors.white} />
      </View>

      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.fullName}</Text>
        <Text style={styles.userUsername}>@{item.username}</Text>
      </View>

      <TouchableOpacity
        style={styles.chatButton}
        onPress={() => handleStartChat(item._id)}
      >
        <Ionicons name="chatbubble" size={20} color={colors.white} />
        <Text style={styles.chatButtonText}>Chat</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={colors.darkGray} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by username..."
          placeholderTextColor={colors.darkGray}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
        />
        {searching && <ActivityIndicator size="small" color={colors.primary} />}
        {searchQuery.length > 0 && !searching && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={colors.darkGray} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.infoContainer}>
        <Ionicons name="information-circle-outline" size={16} color={colors.text} />
        <Text style={styles.infoText}>
          {searchQuery 
            ? 'Search results for registered users' 
            : 'Showing users you have conversations with'}
        </Text>
      </View>

      <FlatList
        data={users}
        renderItem={renderUser}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={80} color={colors.gray} />
            <Text style={styles.emptyText}>
              {searchQuery ? 'No users found' : 'No conversations yet'}
            </Text>
            <Text style={styles.emptySubtext}>
              {searchQuery 
                ? 'Try searching with a different username' 
                : 'Search for users to start chatting'}
            </Text>
          </View>
        }
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    margin: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.gray,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    height: 45,
    fontSize: fontSize.md,
    color: colors.text,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lightGray,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  infoText: {
    fontSize: fontSize.xs,
    color: colors.text,
    marginLeft: spacing.xs,
    flex: 1,
  },
  listContainer: {
    flexGrow: 1,
    paddingBottom: spacing.md,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.white,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: borderRadius.md,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: fontSize.md,
    fontWeight: 'bold',
    color: colors.text,
  },
  userUsername: {
    fontSize: fontSize.sm,
    color: colors.darkGray,
    marginTop: spacing.xs,
  },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  chatButtonText: {
    color: colors.white,
    fontSize: fontSize.sm,
    fontWeight: 'bold',
    marginLeft: spacing.xs,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    marginTop: 100,
  },
  emptyText: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: fontSize.sm,
    color: colors.darkGray,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
});

export default PeopleScreen;
