# 🚀 Hive Setup Guide

Complete step-by-step guide to get Hive running on your device.

---

## Prerequisites

Before you begin, ensure you have:

1. **Node.js** (version 18 or higher)
   - Download from: https://nodejs.org/
   - Verify: `node --version`

2. **npm** (comes with Node.js)
   - Verify: `npm --version`

3. **Expo Go App** (on your phone)
   - iOS: Download from App Store
   - Android: Download from Play Store

---

## Step 1: Install Dependencies

```bash
# Navigate to the frontend folder
cd frontend

# Install all required packages
npm install
```

This will install:
- Expo SDK 54
- React Native 0.76.0
- React Navigation
- AsyncStorage
- All other dependencies

**Expected time:** 2-5 minutes

---

## Step 2: Start the Development Server

```bash
npm start
```

You should see:
- QR code in terminal
- Metro bundler starting
- Options to press `i` (iOS), `a` (Android), or `w` (web)

**Keep this terminal window open!**

---

## Step 3: Run on Your Device

### Option A: Physical Device (Recommended)

1. **Install Expo Go** on your phone
2. **Connect to same WiFi** as your computer
3. **Scan QR code:**
   - iOS: Use Camera app
   - Android: Use Expo Go app

4. **Wait for app to load** (first time takes 1-2 minutes)

### Option B: iOS Simulator (Mac only)

```bash
# Press 'i' in terminal
# Or run:
npm run ios
```

Requirements:
- Xcode installed
- iOS Simulator configured

### Option C: Android Emulator

```bash
# Press 'a' in terminal
# Or run:
npm run android
```

Requirements:
- Android Studio installed
- Android emulator running

---

## Step 4: Test the App

### Login with Demo Account

1. App opens to Login screen
2. Enter credentials:
   - **Email:** emma@hive.com
   - **Password:** 123
3. Tap "Login"
4. You're in! 🎉

### Or Create New Account

1. Tap "Sign Up"
2. Fill in:
   - Full Name
   - Username (unique)
   - Email (valid format)
   - Password (min 3 chars)
3. Tap "Sign Up"
4. Go back and login

---

## Step 5: Explore Features

### Send a Message
1. Go to **Chats** tab
2. Tap any conversation
3. Type a message
4. Tap send button

### Reply to a Message
1. Long-press any message
2. Select "Reply"
3. Type your reply
4. Send

### React to a Message
1. Long-press any message
2. Select "React"
3. Choose an emoji
4. Done!

### Create a Group
1. Go to **Chats** tab
2. Tap + button (bottom right)
3. Enter group name
4. Select 2+ users
5. Tap "Create Group"

### Find Users
1. Go to **People** tab
2. Search by username
3. Tap "Chat" to start conversation

### Edit Profile
1. Go to **Profile** tab
2. Tap "Edit Profile"
3. Update your name
4. Save changes

---

## Troubleshooting

### Problem: Can't install dependencies

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

### Problem: Metro bundler won't start

**Solution:**
```bash
# Clear Expo cache
npm start --clear

# Or reset everything
rm -rf node_modules .expo
npm install
npm start
```

### Problem: Can't scan QR code

**Solutions:**
1. Make sure phone and computer are on **same WiFi**
2. Try tunnel mode:
   ```bash
   npm start --tunnel
   ```
3. Check firewall settings

### Problem: App crashes on startup

**Solutions:**
1. Check Expo Go version (should be 54.x)
2. Update Expo Go app
3. Clear app data in Expo Go
4. Restart development server

### Problem: AsyncStorage errors

**Solution:**
```bash
# Reinstall AsyncStorage
npm uninstall @react-native-async-storage/async-storage
npm install @react-native-async-storage/async-storage@1.23.1
```

### Problem: Navigation errors

**Solution:**
```bash
# Reinstall navigation packages
npm install @react-navigation/native@^7.0.14
npm install @react-navigation/bottom-tabs@^7.2.0
npm install @react-navigation/stack@^7.1.0
npm install react-native-screens@~4.4.0
npm install react-native-safe-area-context@4.15.1
```

### Problem: Gesture handler errors

**Solution:**
```bash
# Reinstall gesture handler
npm install react-native-gesture-handler@~2.20.2
```

---

## Development Tips

### Hot Reload
- Shake device or press `Cmd+D` (iOS) / `Cmd+M` (Android)
- Enable "Fast Refresh" for instant updates

### Debug Menu
- Shake device to open
- Options: Reload, Debug, Performance Monitor

### Console Logs
- View in terminal where you ran `npm start`
- Or use React Native Debugger

### Clear Data
- To reset app data, uninstall and reinstall
- Or clear AsyncStorage in code

---

## Project Structure

```
frontend/
├── src/
│   ├── context/          # State management
│   ├── mock/             # Mock data
│   ├── navigation/       # Navigation setup
│   ├── screens/          # All screens
│   └── utils/            # Utilities
├── App.js                # Root component
├── app.json              # Expo config
├── package.json          # Dependencies
└── README.md             # Documentation
```

---

## Next Steps

1. ✅ App is running
2. ✅ Tested all features
3. 📱 Share with friends
4. 🎨 Customize colors in `src/utils/theme.js`
5. 🚀 Build for production (see below)

---

## Building for Production

### Create Standalone App

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure build
eas build:configure

# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios
```

### Publish Update

```bash
# Publish to Expo
expo publish

# Or use EAS Update
eas update
```

---

## Resources

- **Expo Docs:** https://docs.expo.dev/
- **React Native Docs:** https://reactnative.dev/
- **React Navigation:** https://reactnavigation.org/
- **Expo Forums:** https://forums.expo.dev/

---

## Support

If you encounter issues:

1. Check this guide
2. Read error messages carefully
3. Search Expo forums
4. Check package versions
5. Try clearing cache

---

## Success Checklist

- [ ] Node.js installed
- [ ] Dependencies installed
- [ ] Development server running
- [ ] App opens on device
- [ ] Can login
- [ ] Can send messages
- [ ] Can create groups
- [ ] Can edit profile
- [ ] Data persists after restart

---

**You're all set! Enjoy building with Hive!** 🐝

**Tagline:** *"Connect Your Crew, Your Way."*
