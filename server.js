require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');
const Message = require('./models/Message');
const Chat = require('./models/Chat');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/messages', require('./routes/messages'));

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Hive API is running' });
});

// Socket.IO for real-time messaging
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join chat room
  socket.on('join_chat', (chatId) => {
    socket.join(chatId);
    console.log(`User ${socket.id} joined chat ${chatId}`);
  });

  // Send message
  socket.on('send_message', async (data) => {
    try {
      const { chatId, senderId, content, messageType, imageUrl, replyTo } = data;

      // backend schema allows empty content (e.g., image-only messages)
      const safeContent = content ?? '';

      const message = new Message({
        chatId,
        senderId,
        content: safeContent,
        messageType: messageType || 'text',
        imageUrl,
        replyTo
      });

      await message.save();
      
      const populatedMessage = await Message.findById(message._id)
        .populate('senderId', 'fullName profilePhoto')
        .populate('replyTo');

      // Update chat's last message
      await Chat.findOneAndUpdate(
        { chatId },
        {
          lastMessage: content,
          lastMessageTime: new Date()
        }
      );

      // Emit to all users in the chat room
      io.to(chatId).emit('receive_message', populatedMessage);
    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('message_error', { error: error.message });
    }
  });

  // Add reaction
  socket.on('add_reaction', async (data) => {
    try {
      const { messageId, userId, emoji } = data;

      const message = await Message.findById(messageId);
      if (!message) {
        return socket.emit('reaction_error', { error: 'Message not found' });
      }

      // Remove existing reaction from this user
      message.reactions = message.reactions.filter(
        r => r.userId.toString() !== userId
      );

      // Add new reaction
      message.reactions.push({ userId, emoji });
      await message.save();

      const populatedMessage = await Message.findById(message._id)
        .populate('senderId', 'fullName profilePhoto')
        .populate('replyTo');

      io.to(message.chatId).emit('reaction_updated', populatedMessage);
    } catch (error) {
      console.error('Error adding reaction:', error);
      socket.emit('reaction_error', { error: error.message });
    }
  });

  // Typing indicator
  socket.on('typing', (data) => {
    socket.to(data.chatId).emit('user_typing', {
      userId: data.userId,
      userName: data.userName
    });
  });

  socket.on('stop_typing', (data) => {
    socket.to(data.chatId).emit('user_stop_typing', {
      userId: data.userId
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
