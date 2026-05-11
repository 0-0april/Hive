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
    const { fullName, gender, profession } = req.body;
    
    const updateData = {};
    if (fullName) updateData.fullName = fullName;
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

module.exports = router;
