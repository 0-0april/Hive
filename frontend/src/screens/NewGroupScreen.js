import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config/api';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { colors, spacing, borderRadius, fontSize } from '../utils/theme';

const NewGroupScreen = ({ navigation }) => {
  const { currentUser } = useAuth();
  const { createGroup } = useChat();

  const [groupName, setGroupName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [contactUsers, setContactUsers] = useState([]);

  // Fetch only users the current user has conversed with
  useEffect(() => {
    const fetchConversedUsers = async () => {
      if (!currentUser) return;
      try {
        const response = await axios.get(`${API_URL}/users/conversations`);
        setContactUsers(response.data);
      } catch (error) {
        console.error('Error fetching contacts:', error);
      }
    };
    fetchConversedUsers();
  }, [currentUser]);

  // Filter users (exclude current user) with null checks
  const availableUsers =
    currentUser && contactUsers
      ? contactUsers.filter(
          (user) =>
            user._id !== currentUser._id &&
            user.username.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : [];

  const toggleUserSelection = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      Alert.alert('Error', 'Please enter a group name');
      return;
    }

    if (selectedUsers.length < 2) {
      Alert.alert('Error', 'Please select at least 2 other members (minimum 3 total including you)');
      return;
    }

    const result = await createGroup(groupName.trim(), selectedUsers);

    if (result.success) {
      Alert.alert('Success', 'Group created successfully', [
        {
          text: 'OK',
          onPress: () => {
            // Reset navigation so ChatsScreen re-fetches and shows the new group,
            // then land directly inside the new group chat
            navigation.reset({
              index: 1,
              routes: [
                { name: 'MainTabs' },
                {
                  name: 'Chat',
                  params: {
                    chatId: result.chatId,
                    chatName: result.chatName,
                    isGroup: true,
                  },
                },
              ],
            });
          },
        },
      ]);
    } else {
      Alert.alert('Error', result.message);
    }
  };

  const renderUser = ({ item }) => {
    const isSelected = selectedUsers.includes(item._id);

    return (
      <TouchableOpacity
        style={styles.userItem}
        onPress={() => toggleUserSelection(item._id)}
      >
        <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
          {isSelected && (
            <Ionicons name="checkmark" size={20} color={colors.white} />
          )}
        </View>

        <View style={styles.avatarContainer}>
          <Ionicons name="person" size={24} color={colors.white} />
        </View>

        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.fullName}</Text>
          <Text style={styles.userUsername}>@{item.username}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const canCreate = groupName.trim() && selectedUsers.length >= 2;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Create New Group</Text>
        <Text style={styles.headerSubtitle}>
          Select at least 2 members (3 total including you)
        </Text>
      </View>

      <View style={styles.inputSection}>
        <View style={styles.inputContainer}>
          <Ionicons name="people-outline" size={20} color={colors.text} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Group Name"
            placeholderTextColor={colors.darkGray}
            value={groupName}
            onChangeText={setGroupName}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="search" size={20} color={colors.text} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Search users..."
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
      </View>

      {selectedUsers.length > 0 && (
        <View style={styles.selectedContainer}>
          <Text style={styles.selectedText}>
            Selected: {selectedUsers.length} member{selectedUsers.length !== 1 ? 's' : ''}
            {' '}(Total: {selectedUsers.length + 1})
          </Text>
        </View>
      )}

      <FlatList
        data={availableUsers}
        renderItem={renderUser}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={60} color={colors.gray} />
            <Text style={styles.emptyText}>
              {searchQuery ? 'No users found' : 'No users available'}
            </Text>
          </View>
        }
      />

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.createButton, !canCreate && styles.createButtonDisabled]}
          onPress={handleCreateGroup}
          disabled={!canCreate}
        >
          <Ionicons name="checkmark-circle" size={24} color={colors.white} />
          <Text style={styles.createButtonText}>
            Create Group ({selectedUsers.length + 1} members)
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.white,
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  headerTitle: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: fontSize.sm,
    color: colors.darkGray,
    marginTop: spacing.xs,
  },
  inputSection: {
    backgroundColor: colors.white,
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lightGray,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  icon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    height: 45,
    fontSize: fontSize.md,
    color: colors.text,
  },
  selectedContainer: {
    backgroundColor: colors.success,
    padding: spacing.sm,
    alignItems: 'center',
  },
  selectedText: {
    fontSize: fontSize.sm,
    fontWeight: 'bold',
    color: colors.text,
  },
  listContainer: {
    flexGrow: 1,
    padding: spacing.md,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  checkboxSelected: {
    backgroundColor: colors.primary,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    marginTop: 50,
  },
  emptyText: {
    fontSize: fontSize.md,
    color: colors.darkGray,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  footer: {
    backgroundColor: colors.white,
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
  },
  createButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createButtonDisabled: {
    backgroundColor: colors.gray,
    opacity: 0.6,
  },
  createButtonText: {
    color: colors.white,
    fontSize: fontSize.md,
    fontWeight: 'bold',
    marginLeft: spacing.sm,
  },
});

export default NewGroupScreen;