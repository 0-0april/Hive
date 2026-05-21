const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const cloudinary = require('../config/cloudinary');
const router = express.Router();

// Get current user profile
router.get('/me', auth, async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { fullName, username, email, gender, profession } = req.body;
    
    const updateData = {};
    if (fullName) updateData.fullName = fullName;
    if (username) {
      // Check if username is already taken by another user
      const existingUser = await User.findOne({ 
        username, 
        _id: { $ne: req.userId } 
      });
      if (existingUser) {
        return res.status(400).json({ error: 'Username already taken' });
      }
      updateData.username = username;
    }
    if (email) {
      // Check if email is already taken by another user
      const existingUser = await User.findOne({ 
        email, 
        _id: { $ne: req.userId } 
      });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already registered' });
      }
      updateData.email = email;
    }
    if (gender !== undefined) updateData.gender = gender;
    if (profession !== undefined) updateData.profession = profession;

    const user = await User.findByIdAndUpdate(
      req.userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload profile photo
router.post('/profile/photo', auth, upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'hive/profiles',
          transformation: [
            { width: 400, height: 400, crop: 'fill' }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    // Update user profile photo
    const user = await User.findByIdAndUpdate(
      req.userId,
      { profilePhoto: result.secure_url },
      { new: true }
    ).select('-password');

    res.json({ profilePhoto: user.profilePhoto });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all users (excluding current user)
router.get('/all', auth, async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.userId } })
      .select('-password')
      .sort({ fullName: 1 });
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search users by username (Requirement 8)
router.get('/search', auth, async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.json([]);
    }

    const users = await User.find({
      _id: { $ne: req.userId },
      username: { $regex: query, $options: 'i' }
    })
      .select('-password')
      .limit(20)
      .sort({ username: 1 });
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add friend
router.post('/friends/:friendId', auth, async (req, res) => {
  try {
    const { friendId } = req.params;

    // Check if friend exists
    const friend = await User.findById(friendId);
    if (!friend) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Add friend to current user's friends list
    const user = await User.findById(req.userId);
    if (!user.friends.includes(friendId)) {
      user.friends.push(friendId);
      await user.save();
    }

    res.json({ message: 'Friend added' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get friends list
router.get('/friends', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('friends', '-password');
    res.json(user.friends);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove friend
router.delete('/friends/:friendId', auth, async (req, res) => {
  try {
    const { friendId } = req.params;

    const user = await User.findById(req.userId);
    user.friends = user.friends.filter(id => id.toString() !== friendId);
    await user.save();

    res.json({ message: 'Friend removed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get users with existing conversations (Requirement 7)
router.get('/conversations', auth, async (req, res) => {
  try {
    const Chat = require('../models/Chat');
    
    // Find all chats where user is a participant
    const chats = await Chat.find({
      participants: req.userId,
      isGroup: false
    }).populate('participants', '_id fullName username profilePhoto');

    // Extract unique users from conversations
    const usersMap = new Map();
    
    chats.forEach(chat => {
      chat.participants.forEach(participant => {
        if (participant._id.toString() !== req.userId) {
          usersMap.set(participant._id.toString(), {
            _id: participant._id,
            fullName: participant.fullName,
            username: participant.username,
            profilePhoto: participant.profilePhoto
          });
        }
      });
    });

    const users = Array.from(usersMap.values());
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
