# 🐝 Hive - Connect Your Crew, Your Way

A beautiful, feature-rich messaging app with a baby pink theme built with React Native (Expo) and Node.js. Hive allows you to connect with friends, family, and colleagues through private chats and group conversations.

## ✨ Features

### Authentication & Profile
- ✅ Splash screen with smooth animations
- ✅ User registration with real-time email validation
- ✅ Login with email or mobile number
- ✅ JWT-based authentication
- ✅ Profile management (name, gender, profession, photo)
- ✅ Profile photo upload with Cloudinary integration

### Social Features
- ✅ Browse all registered users
- ✅ Add/remove friends
- ✅ Friends list management

### Messaging
- ✅ Real-time messaging with Socket.IO
- ✅ Private 1-on-1 chats
- ✅ Group chats with multiple users
- ✅ Text messages
- ✅ Image sharing
- ✅ Message reactions (❤️, 👍, 😂, 😮, 😢, 🔥)
- ✅ Reply to messages
- ✅ Delete for me
- ✅ Delete for everyone (within 5 minutes)
- ✅ Typing indicators
- ✅ Chat history

## 🎨 Design

**Theme:** Baby pink, cute, soft, girly, warm, inviting

**Color Palette:**
- Primary (Baby Pink): `#FFB7C5`
- Accent (Soft Rose): `#F4A3B3`
- Background (Light Cream): `#FFF5F6`
- Text (Deep Rose): `#774454`
- Success (Mint): `#B2E0D4`
- Error (Soft Red): `#E88A8A`

## 🛠️ Tech Stack

### Frontend
- **React Native** with **Expo** (~52.0.0)
- **React Navigation** (Stack & Drawer)
- **Socket.IO Client** for real-time messaging
- **React Native Gifted Chat** for chat UI
- **Axios** for API calls
- **Expo Image Picker** for photo selection
- **AsyncStorage** for local data persistence

### Backend
- **Node.js** with **Express**
- **MongoDB** with **Mongoose** ODM
- **Socket.IO** for WebSocket connections
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Multer** for file uploads
- **Cloudinary** for image storage

## 📦 Project Structure

```
hive/
├── backend/                    # Node.js backend
│   ├── config/
│   │   ├── cloudinary.js      # Cloudinary configuration
│   │   └── db.js              # MongoDB connection
│   ├── middleware/
│   │   ├── auth.js            # JWT authentication middleware
│   │   └── upload.js          # Multer file upload configuration
│   ├── models/
│   │   ├── User.js            # User schema
│   │   ├── Message.js         # Message schema
│   │   └── Chat.js            # Chat schema
│   ├── routes/
│   │   ├── auth.js            # Authentication routes
│   │   ├── users.js           # User management routes
│   │   └── messages.js        # Messaging routes
│   ├── server.js              # Main server file with Socket.IO
│   ├── package.json
│   ├── .env.example
│   └── README.md
│
└── frontend/                   # React Native frontend
    ├── src/
    │   ├── config/
    │   │   └── api.js         # API configuration
    │   ├── navigation/
    │   │   └── DrawerNavigator.js
    │   └── screens/
    │       ├── SplashScreen.js
    │       ├── LoginScreen.js
    │       ├── SignUpScreen.js
    │       ├── HomeScreen.js
    │       ├── EditProfileScreen.js
    │       ├── UsersScreen.js
    │       ├── FriendsScreen.js
    │       ├── ChatsListScreen.js
    │       ├── ChatScreen.js
    │       └── CreateGroupScreen.js
    ├── App.js
    ├── app.json
    ├── package.json
    └── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v20 or higher)
- MongoDB Atlas account (free tier)
- Cloudinary account (free tier)
- Expo CLI: `npm install -g expo-cli`

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

5. Start the server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Update API URL in `src/config/api.js`:
```javascript
export const API_URL = 'http://localhost:5000'; // or your deployed backend URL
```

4. Start Expo:
```bash
npm start
```

5. Run on your preferred platform:
- Press `i` for iOS Simulator
- Press `a` for Android Emulator
- Scan QR code with Expo Go app

## 🌐 Deployment

### Backend Deployment (Render - Free Tier)

1. Push code to GitHub
2. Go to [Render](https://render.com/)
3. Create new Web Service
4. Connect GitHub repository
5. Configure:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Add environment variables
6. Deploy!

**Note:** Free tier sleeps after 15 minutes of inactivity (30-60s cold start on wake)

### Frontend Deployment

#### Build APK (Android)
```bash
eas build --platform android
```

#### Build IPA (iOS)
```bash
eas build --platform ios
```

## 💰 Free Tier Limits

- **MongoDB Atlas M0:** 512 MB storage (thousands of messages)
- **Cloudinary:** 25 monthly credits (hundreds of images)
- **Render:** 750 free hours/month (enough for one service)
- **Total Cost:** $0/month for moderate usage

## 📱 Screenshots & Demo

### Key Screens
1. **Splash Screen** - Animated baby pink splash with app logo
2. **Login** - Email/mobile + password with show/hide toggle
3. **Sign Up** - Real-time email validation (green/red indicators)
4. **Home** - User profile with avatar, info cards, edit button
5. **Edit Profile** - Update name, gender, profession, photo
6. **Users** - Browse all users with "Add Friend" buttons
7. **Friends** - Friends list with "Remove" option
8. **Chats** - All conversations with last message preview
9. **Chat** - Real-time messaging with reactions, replies, images
10. **Create Group** - Select users and create group chats

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcrypt
- Environment variables for secrets
- CORS configuration
- HTTPS enforced (on deployment)
- Input validation
- Protected API routes

## 📚 API Documentation

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users/me` - Get current user
- `PUT /api/users/profile` - Update profile
- `POST /api/users/profile/photo` - Upload profile photo
- `GET /api/users/all` - Get all users
- `POST /api/users/friends/:friendId` - Add friend
- `GET /api/users/friends` - Get friends
- `DELETE /api/users/friends/:friendId` - Remove friend

### Messages
- `POST /api/messages/chat` - Create/get chat
- `GET /api/messages/chats/all` - Get all chats
- `GET /api/messages/:chatId` - Get messages
- `POST /api/messages/upload-image` - Upload image
- `DELETE /api/messages/:messageId/delete-for-me` - Delete for me
- `DELETE /api/messages/:messageId/delete-for-everyone` - Delete for everyone

### Socket.IO Events
- `join_chat` - Join chat room
- `send_message` - Send message
- `receive_message` - Receive message
- `add_reaction` - Add reaction
- `reaction_updated` - Reaction updated
- `typing` / `stop_typing` - Typing indicators

## 🐛 Troubleshooting

### Backend won't start
- Check MongoDB connection string
- Verify all environment variables are set
- Ensure port 5000 is not in use

### Frontend can't connect
- Verify backend is running
- Check API_URL in `src/config/api.js`
- For Android emulator: use `http://10.0.2.2:5000`
- For physical device: use your computer's IP address

### Images not uploading
- Verify Cloudinary credentials
- Check file size limits (5MB max)
- Ensure proper permissions for camera/gallery

## 📖 Learning Outcomes

By building Hive, you'll learn:
- React Native fundamentals and advanced patterns
- Real-time communication with Socket.IO
- RESTful API design with Express
- MongoDB database modeling
- JWT authentication
- Image upload and cloud storage
- Navigation patterns (Stack & Drawer)
- State management in React
- Async operations and promises
- Deployment to cloud platforms

## 🤝 Contributing

This is a learning project. Feel free to fork and customize for your needs!

## 📄 License

MIT License - feel free to use this project for learning and personal projects.

## 🙏 Acknowledgments

- React Native & Expo teams
- Socket.IO for real-time capabilities
- MongoDB Atlas for free database hosting
- Cloudinary for image storage
- Render for free backend hosting

---

**Built with ❤️ using React Native, Node.js, and MongoDB**

**Tagline:** *"Connect Your Crew, Your Way."*
