const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Sign Up
router.post('/signup', async (req, res) => {
  try {
    const { fullName, username, email, mobileNumber, password } = req.body;

    console.log('Signup request received:', { fullName, username, email, mobileNumber });

    // Validate required fields
    if (!fullName || !username || !email || !password) {
      return res.status(400).json({ 
        error: 'Please provide all required fields: fullName, username, email, and password' 
      });
    }

    // Validate password strength (Requirement 9)
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ 
        error: 'Password must be at least 8 characters long and contain at least one number and one special character' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({ error: 'Email already registered' });
      }
      if (existingUser.username === username) {
        return res.status(400).json({ error: 'Username already taken' });
      }
    }

    // Create new user
    const user = new User({
      fullName,
      username,
      email,
      mobileNumber: mobileNumber || '',
      password
    });

    await user.save();
    console.log('User created successfully:', user._id);

    res.status(201).json({ message: 'Registered successfully' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: error.message || 'Registration failed. Please try again.' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { emailOrMobile, password } = req.body;

    console.log('Login attempt:', { emailOrMobile });

    // Validate required fields
    if (!emailOrMobile || !password) {
      return res.status(400).json({ error: 'Please provide email/mobile and password' });
    }

    // Find user by email, mobile, or username
    const user = await User.findOne({
      $or: [
        { email: emailOrMobile },
        { mobileNumber: emailOrMobile },
        { username: emailOrMobile }
      ]
    });

    if (!user) {
      console.log('User not found:', emailOrMobile);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      console.log('Invalid password for user:', user.username);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Return user data without password
    const userData = {
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      mobileNumber: user.mobileNumber,
      profilePhoto: user.profilePhoto,
      gender: user.gender,
      profession: user.profession
    };

    console.log('Login successful:', user.username);
    res.json({ token, user: userData });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message || 'Login failed. Please try again.' });
  }
});

module.exports = router;
