import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { colors, spacing, borderRadius, fontSize } from '../utils/theme';

const PeopleScreen = ({ navigation }) => {
  const { currentUser, mockUsers } = useAuth();
  const { startPrivateChat } = useChat();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter users (exclude current user)
  const filteredUsers = mockUsers.filter(
    (user) =>
      user.id !== currentUser.id &&
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStartChat = async (userId) => {
    const result = await startPrivateChat(userId);
    if (result.success) {
      navigation.navigate('Chat', { conversationId: result.conversationId });
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
        onPress={() => handleStartChat(item.id)}
      >
        <Ionicons name="chatbubble" size={20} color={colors.white} />
        <Text style={styles.chatButtonText}>Chat</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
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
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={colors.darkGray} />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filteredUsers}
        renderItem={renderUser}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={80} color={colors.gray} />
            <Text style={styles.emptyText}>
              {searchQuery ? 'No users found' : 'No users available'}
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
});

export default PeopleScreen;
