# Hive Backend

Backend server for Hive messaging app built with Node.js, Express, Socket.IO, and MongoDB.

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the backend directory and add:

```
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 3. MongoDB Atlas Setup
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free M0 cluster
3. Create a database user
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get your connection string and add it to `.env`

### 4. Cloudinary Setup
1. Go to [Cloudinary](https://cloudinary.com/)
2. Sign up for a free account
3. Get your cloud name, API key, and API secret from the dashboard
4. Add them to `.env`

### 5. Run the Server

Development mode (with auto-restart):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/profile/photo` - Upload profile photo
- `GET /api/users/all` - Get all users
- `POST /api/users/friends/:friendId` - Add friend
- `GET /api/users/friends` - Get friends list
- `DELETE /api/users/friends/:friendId` - Remove friend

### Messages & Chats
- `POST /api/messages/chat` - Create or get chat
- `GET /api/messages/chats/all` - Get all chats
- `GET /api/messages/:chatId` - Get messages for a chat
- `POST /api/messages/upload-image` - Upload image for message
- `DELETE /api/messages/:messageId/delete-for-me` - Delete message for current user
- `DELETE /api/messages/:messageId/delete-for-everyone` - Delete message for everyone

## Socket.IO Events

### Client to Server
- `join_chat` - Join a chat room
- `send_message` - Send a message
- `add_reaction` - Add reaction to message
- `typing` - User is typing
- `stop_typing` - User stopped typing

### Server to Client
- `receive_message` - Receive new message
- `reaction_updated` - Reaction added/updated
- `user_typing` - Another user is typing
- `user_stop_typing` - Another user stopped typing
- `message_error` - Error sending message
- `reaction_error` - Error adding reaction

## Deployment to Render

1. Push your code to GitHub
2. Go to [Render](https://render.com/)
3. Create a new Web Service
4. Connect your GitHub repository
5. Configure:
   - Build Command: `npm install`
   - Start Command: `npm start`
6. Add environment variables in Render dashboard
7. Deploy!

## Free Tier Limitations

- Render free tier: Service sleeps after 15 minutes of inactivity
- MongoDB Atlas M0: 512 MB storage
- Cloudinary free: 25 monthly credits
