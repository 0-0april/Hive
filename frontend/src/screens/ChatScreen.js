import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { colors, spacing, borderRadius, fontSize } from '../utils/theme';
import { API_URL } from '../config/api';
import io from 'socket.io-client';

const EMOJIS = ['❤️', '👍', '😂', '😮', '😢'];

const ChatScreen = ({ route, navigation }) => {
  const { chatId, chatName, isGroup } = route.params;
  const { currentUser } = useAuth();
  
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    navigation.setOptions({ title: chatName || 'Chat' });
    fetchMessages();
    markMessagesAsRead();
    setupSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [chatId]);

  const setupSocket = () => {
    const socket = io(API_URL.replace('/api', ''));
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Socket connected');
      socket.emit('join_chat', chatId);
    });

    socket.on('receive_message', (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });

    socket.on('message_read', (data) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === data.messageId
            ? {
                ...msg,
                readBy: [...msg.readBy, { userId: data.userId, readAt: data.readAt }],
              }
            : msg
        )
      );
    });

    socket.on('reaction_updated', (updatedMessage) => {
      setMessages((prev) =>
        prev.map((msg) => (msg._id === updatedMessage._id ? updatedMessage : msg))
      );
    });
  };

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${API_URL}/messages/${chatId}`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
      if (error.response?.status !== 404) {
        Alert.alert('Error', 'Failed to load messages');
      }
    } finally {
      setLoading(false);
    }
  };

  const markMessagesAsRead = async () => {
    try {
      await axios.post(`${API_URL}/messages/${chatId}/mark-read`);
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const getUserName = (senderId) => {
    if (!currentUser) return 'Unknown';
    if (senderId._id === currentUser._id) return 'You';
    return senderId.fullName || 'Unknown';
  };

  const handleSend = async () => {
    if (!message.trim() || !currentUser) return;

    try {
      socketRef.current?.emit('send_message', {
        chatId,
        senderId: currentUser._id,
        content: message.trim(),
        messageType: 'text',
        replyTo: replyTo?._id || null,
      });

      setMessage('');
      setReplyTo(null);
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Failed to send message');
    }
  };

  const handleLongPress = (msg) => {
    setSelectedMessage(msg);
    setShowActionSheet(true);
  };

  const handleReply = () => {
    setReplyTo(selectedMessage);
    setShowActionSheet(false);
  };

  const handleReact = () => {
    setShowActionSheet(false);
    setShowEmojiPicker(true);
  };

  const handleEmojiSelect = (emoji) => {
    if (selectedMessage && socketRef.current && currentUser) {
      socketRef.current.emit('add_reaction', {
        messageId: selectedMessage._id,
        userId: currentUser._id,
        emoji,
      });
    }
    setShowEmojiPicker(false);
    setSelectedMessage(null);
  };

  const renderMessage = ({ item }) => {
    if (!currentUser) return null;
    
    const isMe = item.senderId._id === currentUser._id;
    const isRead = item.readBy?.some((r) => r.userId !== currentUser._id);
    const reactions = item.reactions || [];

    return (
      <TouchableOpacity
        style={[styles.messageContainer, isMe && styles.myMessageContainer]}
        onLongPress={() => handleLongPress(item)}
        activeOpacity={0.7}
      >
        {isGroup && !isMe && (
          <Text style={styles.senderName}>{getUserName(item.senderId)}</Text>
        )}

        {item.replyTo && (
          <View style={styles.replyPreview}>
            <View style={styles.replyLine} />
            <View style={styles.replyContent}>
              <Text style={styles.replyName}>
                {item.replyTo.senderId?.fullName || 'Unknown'}
              </Text>
              <Text style={styles.replyText} numberOfLines={1}>
                {item.replyTo.content}
              </Text>
            </View>
          </View>
        )}

        <View style={[styles.messageBubble, isMe && styles.myMessageBubble]}>
          <Text style={[styles.messageText, isMe && styles.myMessageText]}>
            {item.content}
          </Text>
        </View>

        {reactions.length > 0 && (
          <View style={[styles.reactionsContainer, isMe && styles.myReactionsContainer]}>
            {reactions.map((reaction, index) => (
              <View key={index} style={styles.reactionBubble}>
                <Text style={styles.reactionEmoji}>{reaction.emoji}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.messageFooter}>
          <Text style={[styles.messageTime, isMe && styles.myMessageTime]}>
            {new Date(item.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
          {isMe && (
            <View style={styles.checkmarkContainer}>
              {isRead ? (
                <View style={styles.doubleCheck}>
                  <Ionicons name="checkmark" size={16} color={colors.primary} style={styles.checkmark1} />
                  <Ionicons name="checkmark" size={16} color={colors.primary} style={styles.checkmark2} />
                </View>
              ) : (
                <Ionicons name="checkmark" size={16} color={colors.white} />
              )}
            </View>
          )}
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

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="chatbubble-outline" size={60} color={colors.gray} />
            <Text style={styles.emptyText}>No messages yet</Text>
            <Text style={styles.emptySubtext}>Start the conversation!</Text>
          </View>
        }
      />

      {replyTo && (
        <View style={styles.replyBar}>
          <View style={styles.replyBarContent}>
            <Ionicons name="return-down-forward" size={16} color={colors.text} />
            <View style={styles.replyBarText}>
              <Text style={styles.replyBarName}>
                Replying to {getUserName(replyTo.senderId)}
              </Text>
              <Text style={styles.replyBarMessage} numberOfLines={1}>
                {replyTo.content}
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => setReplyTo(null)}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor={colors.darkGray}
          value={message}
          onChangeText={setMessage}
          multiline
          maxLength={1000}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Ionicons name="send" size={24} color={colors.white} />
        </TouchableOpacity>
      </View>

      {/* Action Sheet Modal */}
      <Modal
        visible={showActionSheet}
        transparent
        animationType="fade"
        onRequestClose={() => setShowActionSheet(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowActionSheet(false)}
        >
          <View style={styles.actionSheet}>
            <TouchableOpacity style={styles.actionItem} onPress={handleReply}>
              <Ionicons name="return-down-forward" size={24} color={colors.text} />
              <Text style={styles.actionText}>Reply</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionItem} onPress={handleReact}>
              <Ionicons name="happy" size={24} color={colors.text} />
              <Text style={styles.actionText}>React</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionItem, styles.cancelAction]}
              onPress={() => setShowActionSheet(false)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Emoji Picker Modal */}
      <Modal
        visible={showEmojiPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowEmojiPicker(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowEmojiPicker(false)}
        >
          <View style={styles.emojiPicker}>
            <Text style={styles.emojiPickerTitle}>React with</Text>
            <View style={styles.emojiList}>
              {EMOJIS.map((emoji) => (
                <TouchableOpacity
                  key={emoji}
                  style={styles.emojiButton}
                  onPress={() => handleEmojiSelect(emoji)}
                >
                  <Text style={styles.emoji}>{emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
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
  messagesList: {
    padding: spacing.md,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
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
  },
  messageContainer: {
    marginBottom: spacing.md,
    alignItems: 'flex-start',
  },
  myMessageContainer: {
    alignItems: 'flex-end',
  },
  senderName: {
    fontSize: fontSize.xs,
    color: colors.darkGray,
    marginBottom: spacing.xs,
    marginLeft: spacing.sm,
  },
  replyPreview: {
    flexDirection: 'row',
    backgroundColor: colors.lightGray,
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    marginBottom: spacing.xs,
    maxWidth: '80%',
  },
  replyLine: {
    width: 3,
    backgroundColor: colors.primary,
    borderRadius: 2,
    marginRight: spacing.sm,
  },
  replyContent: {
    flex: 1,
  },
  replyName: {
    fontSize: fontSize.xs,
    fontWeight: 'bold',
    color: colors.primary,
  },
  replyText: {
    fontSize: fontSize.xs,
    color: colors.darkGray,
    marginTop: 2,
  },
  messageBubble: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    maxWidth: '80%',
  },
  myMessageBubble: {
    backgroundColor: colors.primary,
  },
  messageText: {
    fontSize: fontSize.md,
    color: colors.text,
  },
  myMessageText: {
    color: colors.white,
  },
  reactionsContainer: {
    flexDirection: 'row',
    marginTop: spacing.xs,
  },
  myReactionsContainer: {
    justifyContent: 'flex-end',
  },
  reactionBubble: {
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: spacing.xs,
  },
  reactionEmoji: {
    fontSize: 16,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  messageTime: {
    fontSize: fontSize.xs,
    color: colors.darkGray,
  },
  myMessageTime: {
    textAlign: 'right',
  },
  checkmarkContainer: {
    marginLeft: spacing.xs,
  },
  doubleCheck: {
    flexDirection: 'row',
    position: 'relative',
    width: 20,
    height: 16,
  },
  checkmark1: {
    position: 'absolute',
    left: 0,
  },
  checkmark2: {
    position: 'absolute',
    left: 4,
  },
  replyBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lightGray,
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.gray,
  },
  replyBarContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  replyBarText: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  replyBarName: {
    fontSize: fontSize.xs,
    fontWeight: 'bold',
    color: colors.text,
  },
  replyBarMessage: {
    fontSize: fontSize.xs,
    color: colors.darkGray,
    marginTop: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: spacing.md,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray,
  },
  input: {
    flex: 1,
    backgroundColor: colors.lightGray,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: fontSize.md,
    color: colors.text,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: colors.primary,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  actionSheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
    padding: spacing.md,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  actionText: {
    fontSize: fontSize.md,
    color: colors.text,
    marginLeft: spacing.md,
    fontWeight: '600',
  },
  cancelAction: {
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  cancelText: {
    fontSize: fontSize.md,
    color: colors.error,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  emojiPicker: {
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  emojiPickerTitle: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  emojiList: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  emojiButton: {
    padding: spacing.md,
  },
  emoji: {
    fontSize: 40,
  },
});

export default ChatScreen;