const express = require('express');
const Message = require('../models/Message');
const Chat = require('../models/Chat');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const cloudinary = require('../config/cloudinary');
const router = express.Router();

// Get messages for a chat
router.get('/:chatId', auth, async (req, res) => {
  try {
    const { chatId } = req.params;
    
    const messages = await Message.find({
      chatId,
      deletedForEveryone: false,
      deletedFor: { $ne: req.userId }
    })
      .populate('senderId', 'fullName profilePhoto')
      .populate('replyTo')
      .sort({ createdAt: 1 });

    res.json(messages);
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

    // Upload to Cloudinary
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

    // Check if user is the sender
    if (message.senderId.toString() !== req.userId) {
      return res.status(403).json({ error: 'You can only delete your own messages' });
    }

    // Check if message is within 5 minutes
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

// Get or create chat
router.post('/chat', auth, async (req, res) => {
  try {
    const { participantIds, isGroup, groupName } = req.body;

    // Ensure current user is in participants
    const allParticipants = [...new Set([req.userId, ...participantIds])];

    if (isGroup) {
      // Create new group chat
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
      // Private chat - create chatId from sorted user IDs
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

// Get all chats for current user
router.get('/chats/all', auth, async (req, res) => {
  try {
    const chats = await Chat.find({
      participants: req.userId
    })
      .populate('participants', 'fullName profilePhoto')
      .sort({ lastMessageTime: -1 });

    res.json(chats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
