const express = require('express');
const Message = require('../models/Message');
const Chat = require('../models/Chat');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const cloudinary = require('../config/cloudinary');
const router = express.Router();

// 👇 temporary debug log
router.use((req, res, next) => {
  console.log('Messages router hit:', req.method, req.path);
  next();
});

// ⚠️ IMPORTANT: Static routes must come BEFORE dynamic /:param routes

// Get all chats for current user
router.get('/chats/all', auth, async (req, res) => {
  try {
    const chats = await Chat.find({
      participants: req.userId
    })
      .populate('participants', 'fullName username profilePhoto')
      .sort({ lastMessageTime: -1 });

    const chatsWithUnread = await Promise.all(
      chats.map(async (chat) => {
        const unreadCount = await require('../models/Message').countDocuments({
          chatId: chat.chatId,
          senderId: { $ne: req.userId },
          'readBy.userId': { $ne: req.userId }
        });

        return {
          ...chat.toObject(),
          unreadCount
        };
      })
    );

    res.json(chatsWithUnread);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get or create chat
router.post('/chat', auth, async (req, res) => {
  try {
    const { participantIds, isGroup, groupName } = req.body;

    const allParticipants = [...new Set([req.userId, ...participantIds])];

    if (isGroup) {
      const chatId = `group_${Date.now()}`;
      const chat = new Chat({
        chatId,
        isGroup: true,
        groupName,
        participants: allParticipants,
        createdBy: req.userId
      });
      await chat.save();
      
      const populatedChat = await Chat.findById(chat._id)
        .populate('participants', 'fullName profilePhoto');
      
      return res.json(populatedChat);
    } else {
      const sortedIds = allParticipants.sort();
      const chatId = `private_${sortedIds.join('_')}`;

      let chat = await Chat.findOne({ chatId });
      
      if (!chat) {
        chat = new Chat({
          chatId,
          isGroup: false,
          participants: allParticipants
        });
        await chat.save();
      }

      const populatedChat = await Chat.findById(chat._id)
        .populate('participants', 'fullName profilePhoto');
      
      return res.json(populatedChat);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload image for message
router.post('/upload-image', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'hive/messages',
          transformation: [
            { width: 1200, height: 1200, crop: 'limit' }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    res.json({ imageUrl: result.secure_url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete/clear a private chat
router.delete('/chats/:chatId', auth, async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findOne({ chatId });
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    if (!chat.participants.includes(req.userId)) {
      return res.status(403).json({ error: 'Not a participant of this chat' });
    }

    await Message.deleteMany({ chatId });
    await Chat.deleteOne({ chatId });

    res.json({ message: 'Conversation deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Leave a group chat
router.post('/chats/:chatId/leave', auth, async (req, res) => {
  try {
    const { chatId } = req.params;
    console.log('Leave group request for chatId:', chatId, 'userId:', req.userId);

    const chat = await Chat.findOne({ chatId });
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    if (!chat.participants.map(p => p.toString()).includes(req.userId)) {
      return res.status(403).json({ error: 'Not a participant of this chat' });
    }

    if (!chat.isGroup) {
      return res.status(400).json({ error: 'Cannot leave a private chat' });
    }

    chat.participants = chat.participants.filter(
      (p) => p.toString() !== req.userId
    );

    if (chat.participants.length === 0) {
      await Message.deleteMany({ chatId });
      await Chat.deleteOne({ chatId });
    } else {
      await chat.save();
    }

    res.json({ message: 'Left group successfully' });
  } catch (error) {
    console.error('Leave group error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ⚠️ Dynamic routes below — these must come AFTER all static routes

// Get messages for a chat
router.get('/:chatId', auth, async (req, res) => {
  try {
    const { chatId } = req.params;
    
    const messages = await Message.find({
      chatId,
      deletedForEveryone: false,
      deletedFor: { $ne: req.userId }
    })
      .populate('senderId', 'fullName username profilePhoto')
      .populate('replyTo')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark messages as read
router.post('/:chatId/mark-read', auth, async (req, res) => {
  try {
    const { chatId } = req.params;
    
    const messages = await Message.find({
      chatId,
      senderId: { $ne: req.userId },
      'readBy.userId': { $ne: req.userId }
    });

    for (const message of messages) {
      message.readBy.push({
        userId: req.userId,
        readAt: new Date()
      });
      await message.save();
    }

    res.json({ message: 'Messages marked as read', count: messages.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete message for me
router.delete('/:messageId/delete-for-me', auth, async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    if (!message.deletedFor.includes(req.userId)) {
      message.deletedFor.push(req.userId);
      await message.save();
    }

    res.json({ message: 'Message deleted for you' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete message for everyone
router.delete('/:messageId/delete-for-everyone', auth, async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    if (message.senderId.toString() !== req.userId) {
      return res.status(403).json({ error: 'You can only delete your own messages' });
    }

    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    if (message.createdAt < fiveMinutesAgo) {
      return res.status(403).json({ error: 'Can only delete messages within 5 minutes' });
    }

    message.deletedForEveryone = true;
    message.content = 'This message was deleted';
    await message.save();

    res.json({ message: 'Message deleted for everyone' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;