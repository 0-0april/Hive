## App Name & Tagline

**App Name:** **Hive**  
**Tagline:** **"Connect Your Crew, Your Way."**

---

## 🎨 Branding & Design (Same as original)

**Core Theme:** Baby pink, cute, soft, girly, warm, inviting  

**Primary Color Palette:**  
- Primary (Baby Pink): `#FFB7C5`  
- Accent (Soft Rose): `#F4A3B3`  
- Background (Light Cream): `#FFF5F6`  
- Text (Deep Rose): `#774454`  
- Success (Mint): `#B2E0D4`  
- Error (Soft Red): `#E88A8A`  

**Typography:** Rounded fonts (Poppins, Nunito, Quicksand)  
**UI Elements:** Soft corners, gentle shadows, playful icons, smooth transitions.

---

## 📱 Core Features (Frontend Only – Mock Data)

### 1. Login Screen
- Fields: **Email**, **Password**  
- Hardcoded mock user (any email/password works for demo, or check against a mock array)  
- On login → store mock token in AsyncStorage → navigate to **Chats tab**

### 2. Sign Up Screen
- Fields: **Full Name**, **Username** (unique among mock users), **Email**, **Password**  
- Validate email format, username availability (check mock user list)  
- On success → add user to mock data → toast: `"Registered successfully"` → go to Login

### 3. Authentication (Mock)
- Simulate JWT: store a mock user ID in AsyncStorage  
- On app restart, read stored user → if exists, skip login

### 4. Main UI – Bottom Tab Bar

| Tab | Content |
|-----|---------|
| **Chats** | List of all private & group conversations (mock data, ordered by last message time) |
| **People** | Search for users by **username** (from mock user list) → start a chat or add to group |
| **Profile** | View/edit own profile (mock user) |

### 5. Edit Profile Screen
- Pre‑populated with mock user data: **Full Name**, **Username** (non‑editable), **Email** (non‑editable)  
- Editable: **Full Name** only (update local mock state + AsyncStorage)  
- On update → Profile tab refreshes

### 6. Add User via Username
- In **People** tab: search bar => filter mock users (excluding self)  
- Tap **"Chat"** → creates a private conversation (if not exists) and opens chat screen (mock data)

### 7. Private Messaging (Mock Real‑time)
- Chat screen loads mock message history for that conversation  
- **Send text messages** – new message appended locally (no backend)  
- **Reply to a message**: long‑press → choose "Reply" → quoted preview → send reply (stores reply chain in mock data)  
- **React to a message**: long‑press → emoji picker (❤️, 👍, 😂, 😮, 😢) → reaction stored locally

### 8. Group Chats (Min 3 Users)
- In **Chats** tab → button **"New Group"**  
- Flow:  
  1. Enter group name  
  2. Search users by username and tap to add (checkbox style)  
  3. **Minimum participants**: you + at least 2 other distinct users → creation button enabled  
- After creation → group conversation appears in Chats list  
- Inside group → reply & reactions work the same as private

### 9. Sign Out
- Button in Profile tab → clear AsyncStorage → return to Login

---

## 🗃️ Mock Data Structure (JavaScript)

```javascript
// Mock users
const mockUsers = [
  { id: 'u1', fullName: 'Emma Watson', username: 'emma_w', email: 'emma@hive.com', password: '123' },
  { id: 'u2', fullName: 'Olivia Chen', username: 'olivia_c', email: 'olivia@hive.com', password: '123' },
  { id: 'u3', fullName: 'Sophia Rossi', username: 'sophia_r', email: 'sophia@hive.com', password: '123' },
  { id: 'u4', fullName: 'Mia Kim', username: 'mia_k', email: 'mia@hive.com', password: '123' },
  // current logged user will be added at signup or a default current user
];

// Default current user (for immediate demo)
const currentUser = { id: 'current', fullName: 'You', username: 'me', email: 'me@hive.com' };

// Conversations: { id, type: 'private'|'group', name (for groups), participants: [userId], lastMessage, updatedAt, messages: [] }
// Messages: { id, conversationId, senderId, text, createdAt, replyToId (optional), reactions: { userId: emoji } }
```

All interactions (send message, add reaction, reply, create group) mutate these mock arrays.  
No network calls – pure in‑memory + AsyncStorage for persistence (optional, but recommended so data survives app restarts).


## 📁 Project Structure (Frontend Only)

```
HIVE/
├── backend/               # Empty (or delete – not needed for mock frontend)
├── frontend/              # All React Native (Expo 55) code goes here
│   ├── App.js
│   ├── src/
│   │   ├── screens/
│   │   ├── components/
│   │   ├── mock/
│   │   ├── context/
│   │   └── utils/
│   ├── package.json
│   └── app.json
├── platform-tools/        # (optional – keep as is)
├── .gitignore
├── PROJECT_SUMMARY.md
├── QUICK_START.md
├── README.md
└── requirements.md

## 🔧 Mock Data Management

**Storage functions:**
- `loadMockData()` – reads from AsyncStorage or initialises default mock data (including currentUser)
- `saveMockData(data)` – writes entire state
- `addMessage(conversationId, text, replyToId)`
- `addReaction(messageId, emoji)`
- `createGroup(name, participantIds)`
- `startPrivateChat(otherUserId)`

All changes persist via `saveMockData` so they survive app restarts.

**No WebSockets** – messages appear instantly because state is updated locally and re‑renders the ChatScreen.

---

## 📱 Screen Implementation Highlights

### LoginScreen
- Use `AuthContext` to call `login(email, password)` which checks against mockUsers.
- Store `currentUser` and mock data to AsyncStorage.

### ChatScreen
- Accept `conversationId` param.
- Use `FlatList` for messages.
- Long‑press message → show `ActionSheet` (or custom modal) with **Reply** and **React** options.
- For reactions – open `EmojiPickerModal` and call `addReaction`.
- For reply – set `replyTo` state, show preview, send message with `replyToId`.

### NewGroupScreen
- Display list of all users except current (searchable).
- Checkbox selection.
- Count selected users – disable create button if less than 2.
- On create → call `createGroup(name, [currentUserId, ...selectedIds])` → navigate to the group chat.

---

## 🎯 What Is NOT Included (Specifically Removed)

- Any backend code (N MongoDB, Socket.IO)
- Real API calls / fetch / axios
- Image upload / Cloudinary
- Push notifications
- Delete messages (for me / everyone)
- Friend / follow system
- Side drawer
- Guest login / Google login
- Typing indicators
- Message editing

All these are **frontend-only mock simulations** with persistent storage via AsyncStorage.

Expo SDK version: 54
Expo Go version: 54.0.6



### Requirements to be Implemented
0. it should allow users ro login and signup using credentials. make sure you use encryption for its password.

1. the user should be able to show/hide the typed password in the login screen
2. always check the database connections every action. In the frontend/src/screens/ChatScreens.js, there shouldn't be repeated cards for users that was messaged. it should list down the names of the users or group names and its latest message and its time that it was sent only and their icons or images.

3. in the PeopleScreen.js, the logged in user should have access to the list of users through matched username on the serach bar. but it initially displays the users that is already added/messaged on the app.

4. in the ProfileScreen.js, when the logged in user signs out, it should display the login page directly.

5. in the EditProfileScreen.js, the logged it user should be allowed to modify their names, usernames and email. 


6. in the ChatsScreen.js, the message that was sent by a user(sender) should be visible to the users(receiver) forever. make sure it works on all the list of the user in the database. and also the new and unread message should be highlighted so the logged in user know when there is a new message received from the other user.

7. the list of people should be only be visible when there is an existing conversation between the logged in user and the user displayed in the people. this exclude the people who have the same groupchat.

8. the user should be able to search for an existing/registered users (only) through usernames in the people part and enable to send them chats. 

9. it shouldn't allow simple passwords when signing up new accounts, it should have at least 8 characters with number and special characters

10. make sure this project runs on local storage but it also records all the inputed data through its UI when it was used instead of just disappearing.

11. do not change the UI unless i told you to do so. just change the logic and database connection to make it reasonable for the user.



12. the sign up for new user should confirm the password instead of asking it once, they should match as well