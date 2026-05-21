import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { colors, spacing, borderRadius, fontSize, shadow } from '../utils/theme';
import { useFocusEffect } from '@react-navigation/native';
import { API_URL } from '../config/api';

const ChatsScreen = ({ navigation }) => {
  const { currentUser } = useAuth();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionSheet, setActionSheet] = useState({ visible: false, chat: null });

  useFocusEffect(
    React.useCallback(() => {
      fetchChats();
    }, [])
  );

  const fetchChats = async () => {
    try {
      const response = await axios.get(`${API_URL}/messages/chats/all`);
      setChats(response.data);
    } catch (error) {
      console.error('Error fetching chats:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchChats();
  };

  const handleLongPress = (chat) => {
    setActionSheet({ visible: true, chat });
  };

  const closeActionSheet = () => {
    setActionSheet({ visible: false, chat: null });
  };

  const confirmDelete = (chat) => {
    closeActionSheet();
    Alert.alert(
      'Delete Conversation',
      `Delete "${getChatName(chat)}"? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteChat(chat) },
      ]
    );
  };

  const confirmLeave = (chat) => {
    closeActionSheet();
    Alert.alert(
      'Leave Group',
      `Leave "${getChatName(chat)}"? You won't receive messages anymore.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Leave', style: 'destructive', onPress: () => leaveGroup(chat) },
      ]
    );
  };

  const deleteChat = async (chat) => {
    setChats((prev) => prev.filter((c) => c.chatId !== chat.chatId));
    try {
      await axios.delete(`${API_URL}/messages/chats/${chat.chatId}`);
    } catch (error) {
      console.error('Error deleting chat:', error);
      setChats((prev) =>
        [...prev, chat].sort((a, b) =>
          new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
        )
      );
      Alert.alert('Error', 'Failed to delete conversation. Please try again.');
    }
  };

  const leaveGroup = async (chat) => {
    console.log('=== LEAVE GROUP DEBUG ===');
    console.log('API_URL:', API_URL);
    console.log('chat.chatId:', chat.chatId);
    console.log('Full URL:', `${API_URL}/messages/chats/${chat.chatId}/leave`);
    console.log('Full chat:', JSON.stringify(chat, null, 2));
    console.log('=========================');
    setChats((prev) => prev.filter((c) => c.chatId !== chat.chatId));
    try {
      await axios.post(`${API_URL}/messages/chats/${chat.chatId}/leave`);
    } catch (error) {
      console.error('Error leaving group:', error);
      setChats((prev) =>
        [...prev, chat].sort((a, b) =>
          new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
        )
      );
      Alert.alert('Error', 'Failed to leave group. Please try again.');
    }
  };

  const getOtherParticipant = (chat) => {
    if (chat.isGroup || !currentUser) return null;
    return chat.participants.find(p => p._id !== currentUser._id);
  };

  const getChatName = (chat) => {
    if (chat.isGroup) return chat.groupName || 'Group Chat';
    const otherUser = getOtherParticipant(chat);
    return otherUser ? otherUser.fullName : 'Unknown User';
  };

  const getChatAvatar = (chat) => {
    return chat.isGroup ? 'people' : 'person';
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  };

  const renderChat = ({ item }) => {
    const hasUnread = item.unreadCount > 0;

    return (
      <TouchableOpacity
        style={[styles.chatItem, hasUnread && styles.chatItemUnread]}
        onPress={() => navigation.navigate('Chat', {
          chatId: item.chatId,
          chatName: getChatName(item),
          isGroup: item.isGroup
        })}
        onLongPress={() => handleLongPress(item)}
        delayLongPress={400}
      >
        <View style={styles.avatarContainer}>
          <Ionicons name={getChatAvatar(item)} size={30} color={colors.white} />
        </View>

        <View style={styles.chatInfo}>
          <View style={styles.chatHeader}>
            <Text style={[styles.chatName, hasUnread && styles.chatNameUnread]}>
              {getChatName(item)}
            </Text>
            <Text style={styles.chatTime}>{formatTime(item.lastMessageTime)}</Text>
          </View>
          <View style={styles.lastMessageContainer}>
            <Text
              style={[styles.lastMessage, hasUnread && styles.lastMessageUnread]}
              numberOfLines={1}
            >
              {item.lastMessage || 'No messages yet'}
            </Text>
            {hasUnread && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadCount}>{item.unreadCount}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const selectedChat = actionSheet.chat;

  return (
    <View style={styles.container}>
      <FlatList
        data={chats}
        renderItem={renderChat}
        keyExtractor={(item) => item.chatId}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="chatbubbles-outline" size={80} color={colors.gray} />
            <Text style={styles.emptyText}>No conversations yet</Text>
            <Text style={styles.emptySubtext}>
              Start chatting with people from the People tab
            </Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('NewGroup')}
      >
        <Ionicons name="add" size={30} color={colors.white} />
      </TouchableOpacity>

      {/* Long-press Action Sheet */}
      <Modal
        visible={actionSheet.visible}
        transparent
        animationType="fade"
        onRequestClose={closeActionSheet}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={closeActionSheet}
        >
          <View style={styles.actionSheet}>
            {selectedChat && (
              <Text style={styles.actionSheetTitle} numberOfLines={1}>
                {getChatName(selectedChat)}
              </Text>
            )}

            {selectedChat?.isGroup ? (
              // Group chat options
              <TouchableOpacity
                style={styles.actionItem}
                onPress={() => confirmLeave(selectedChat)}
              >
                <Ionicons name="exit-outline" size={22} color={colors.error} />
                <Text style={[styles.actionText, styles.actionTextDestructive]}>
                  Leave Group
                </Text>
              </TouchableOpacity>
            ) : (
              // Private chat options
              <TouchableOpacity
                style={styles.actionItem}
                onPress={() => confirmDelete(selectedChat)}
              >
                <Ionicons name="trash-outline" size={22} color={colors.error} />
                <Text style={[styles.actionText, styles.actionTextDestructive]}>
                  Delete Conversation
                </Text>
              </TouchableOpacity>
            )}

            <View style={styles.actionDivider} />

            <TouchableOpacity
              style={styles.actionItem}
              onPress={closeActionSheet}
            >
              <Ionicons name="close-outline" size={22} color={colors.text} />
              <Text style={styles.actionText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
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
  listContainer: {
    flexGrow: 1,
  },
  chatItem: {
    flexDirection: 'row',
    padding: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  chatItemUnread: {
    backgroundColor: '#FFF9FA',
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  chatInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  chatName: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
  },
  chatNameUnread: {
    fontWeight: 'bold',
  },
  chatTime: {
    fontSize: fontSize.xs,
    color: colors.darkGray,
  },
  lastMessageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lastMessage: {
    flex: 1,
    fontSize: fontSize.sm,
    color: colors.darkGray,
  },
  lastMessageUnread: {
    fontWeight: '600',
    color: colors.text,
  },
  unreadBadge: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    marginLeft: spacing.sm,
  },
  unreadCount: {
    color: colors.white,
    fontSize: 11,
    fontWeight: 'bold',
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
  },
  emptySubtext: {
    fontSize: fontSize.sm,
    color: colors.darkGray,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadow.medium,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  actionSheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  actionSheetTitle: {
    fontSize: fontSize.md,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
  },
  actionDivider: {
    height: 1,
    backgroundColor: colors.lightGray,
    marginVertical: spacing.sm,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.md,
  },
  actionText: {
    fontSize: fontSize.md,
    color: colors.text,
    marginLeft: spacing.md,
    fontWeight: '500',
  },
  actionTextDestructive: {
    color: colors.error,
    fontWeight: '600',
  },
});

export default ChatsScreen;