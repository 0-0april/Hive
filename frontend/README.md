# 🐝 Hive - Frontend (Mock Data Version)

**Tagline:** *"Connect Your Crew, Your Way."*

A beautiful baby pink-themed messaging app built with React Native and Expo. This is a **frontend-only mock data version** that simulates all features without requiring a backend.

---

## ✨ Features

### Authentication
- ✅ Login with email/password
- ✅ Sign up with validation
- ✅ Mock JWT authentication
- ✅ Auto-login on app restart
- ✅ Logout functionality

### Messaging
- ✅ Private 1-on-1 chats
- ✅ Group chats (minimum 3 members)
- ✅ Send text messages
- ✅ Reply to messages with preview
- ✅ React to messages (❤️, 👍, 😂, 😮, 😢)
- ✅ Long-press for actions
- ✅ Real-time-like updates (instant local state)

### User Management
- ✅ Browse all users
- ✅ Search users by username
- ✅ Start private chats
- ✅ View and edit profile
- ✅ Profile persistence

### Design
- ✅ Baby pink color theme
- ✅ Soft, rounded UI elements
- ✅ Smooth animations
- ✅ Intuitive navigation
- ✅ Bottom tab bar (Chats, People, Profile)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Expo Go app on your phone (iOS/Android)

### Installation

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start the app
npm start
```

### Run on Device

1. **iOS Simulator**: Press `i` in terminal
2. **Android Emulator**: Press `a` in terminal
3. **Physical Device**: 
   - Install Expo Go from App Store/Play Store
   - Scan QR code from terminal

---

## 🎯 Demo Accounts

Use these credentials to test immediately:

- **Email:** emma@hive.com | **Password:** 123
- **Email:** olivia@hive.com | **Password:** 123
- **Email:** sophia@hive.com | **Password:** 123
- **Email:** mia@hive.com | **Password:** 123

Or create your own account via Sign Up!

---

## 📱 How to Use

### 1. Login or Sign Up
- Use demo credentials or create a new account
- Email validation is enforced
- Username must be unique

### 2. Browse Chats
- View all your conversations
- Tap to open a chat
- See last message and time

### 3. Find People
- Search users by username
- Tap "Chat" to start a conversation
- Instantly navigate to chat screen

### 4. Send Messages
- Type and send text messages
- Messages appear instantly (mock real-time)

### 5. Reply to Messages
- Long-press any message
- Select "Reply"
- See quoted preview
- Send your reply

### 6. React to Messages
- Long-press any message
- Select "React"
- Choose an emoji (❤️, 👍, 😂, 😮, 😢)
- Tap same emoji again to remove reaction

### 7. Create Group Chats
- Tap + button in Chats tab
- Enter group name
- Search and select users (minimum 2 others)
- Create button enables when valid
- Start chatting with your group

### 8. Edit Profile
- Go to Profile tab
- Tap "Edit Profile"
- Update your full name
- Username and email are non-editable

### 9. Sign Out
- Go to Profile tab
- Tap "Sign Out"
- Confirm logout

---

## 🗂️ Project Structure

```
frontend/
├── src/
│   ├── context/
│   │   ├── AuthContext.js          # Authentication state
│   │   └── ChatContext.js          # Chat state management
│   ├── mock/
│   │   └── data.js                 # Mock users and data
│   ├── navigation/
│   │   └── AppNavigator.js         # Navigation setup
│   ├── screens/
│   │   ├── LoginScreen.js          # Login page
│   │   ├── SignUpScreen.js         # Registration
│   │   ├── ChatsScreen.js          # Conversations list
│   │   ├── PeopleScreen.js         # User discovery
│   │   ├── ProfileScreen.js        # User profile
│   │   ├── EditProfileScreen.js    # Edit profile
│   │   ├── ChatScreen.js           # Messaging
│   │   └── NewGroupScreen.js       # Create groups
│   └── utils/
│       ├── storage.js              # AsyncStorage utilities
│       └── theme.js                # Colors and styles
├── App.js                          # Root component
├── app.json                        # Expo configuration
├── package.json                    # Dependencies
└── README.md                       # This file
```

---

## 🎨 Design System

### Color Palette
```javascript
Primary (Baby Pink):    #FFB7C5
Accent (Soft Rose):     #F4A3B3
Background (Cream):     #FFF5F6
Text (Deep Rose):       #774454
Success (Mint):         #B2E0D4
Error (Soft Red):       #E88A8A
```

### Typography
- Rounded, friendly fonts
- Clear hierarchy
- Readable sizes (12-24px)

### UI Elements
- Soft corners (10-25px radius)
- Gentle shadows
- Ionicons throughout
- Smooth transitions

---

## 🔧 Technologies Used

| Package | Version | Purpose |
|---------|---------|---------|
| expo | ~54.0.0 | React Native framework |
| react-native | 0.76.0 | Mobile framework |
| @react-navigation/native | ^7.0.14 | Navigation |
| @react-navigation/bottom-tabs | ^7.2.0 | Bottom tabs |
| @react-navigation/stack | ^7.1.0 | Stack navigation |
| @react-native-async-storage/async-storage | 1.23.1 | Local storage |
| react-native-gesture-handler | ~2.20.2 | Gestures |
| @expo/vector-icons | ^14.0.0 | Icons |
| react-native-keyboard-aware-scroll-view | ^0.9.5 | Keyboard handling |

---

## 💾 Data Persistence

All data is stored locally using AsyncStorage:

- **Current user** - Persists login state
- **Mock conversations** - All chats and messages
- **User profiles** - Profile updates

Data survives app restarts and device reboots.

---

## 🚫 What's NOT Included

This is a **frontend-only mock version**. The following are intentionally excluded:

- ❌ Backend server (Node.js, Express)
- ❌ Real database (MongoDB)
- ❌ Real-time WebSockets (Socket.IO)
- ❌ Image upload
- ❌ Push notifications
- ❌ Delete messages
- ❌ Friend system
- ❌ Typing indicators (real-time)
- ❌ Message editing

All features are simulated with local state and AsyncStorage.

---

## 🐛 Troubleshooting

### App won't start
```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
npm start --clear
```

### Can't scan QR code
- Make sure phone and computer are on same WiFi
- Try tunnel mode: `npm start --tunnel`

### AsyncStorage errors
```bash
# Reinstall AsyncStorage
npm uninstall @react-native-async-storage/async-storage
npm install @react-native-async-storage/async-storage@1.23.1
```

### Navigation errors
```bash
# Reinstall navigation packages
npm install @react-navigation/native@^7.0.14
npm install @react-navigation/bottom-tabs@^7.2.0
npm install @react-navigation/stack@^7.1.0
```

---

## 📚 Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [React Navigation](https://reactnavigation.org/)
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/)

---

## 🎓 Key Concepts Demonstrated

### React Native
- Component architecture
- Hooks (useState, useEffect, useContext)
- Navigation (Stack + Bottom Tabs)
- FlatList optimization
- Modal components
- Keyboard handling

### State Management
- Context API for global state
- Local component state
- AsyncStorage for persistence

### UI/UX
- Responsive design
- Touch interactions
- Long-press gestures
- Modal overlays
- Form validation

---

## 🎉 Success!

You now have a fully functional messaging app with:
- ✅ Authentication
- ✅ Private & group chats
- ✅ Message replies
- ✅ Emoji reactions
- ✅ User discovery
- ✅ Profile management
- ✅ Data persistence

**Enjoy your Hive app!** 🐝

---

**Built with ❤️ using React Native and Expo**

**Tagline:** *"Connect Your Crew, Your Way."*
