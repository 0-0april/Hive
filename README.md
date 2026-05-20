# Hive Backend API

A real-time messaging backend built with Node.js, Express, Socket.IO, and MongoDB.

## ✨ Features

✅ User authentication (signup/login with JWT)  
✅ User profiles with photo uploads to Cloudinary  
✅ Friend management  
✅ One-to-one and group chats  
✅ Real-time messaging with Socket.IO  
✅ Message reactions (emoji)  
✅ Reply to messages  
✅ Delete messages (for self or everyone)  
✅ Typing indicators  
✅ Image sharing  

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Real-time**: Socket.IO
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Password Security**: bcryptjs
- **File Upload**: Multer + Cloudinary
- **Environment**: dotenv

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Then fill in your credentials for:
- MongoDB Atlas connection string, or leave blank to use local MongoDB at `mongodb://127.0.0.1:27017/hive`
- JWT secret
- Cloudinary API keys (optional if you do not upload images)

See [BACKEND_SETUP.md](./BACKEND_SETUP.md) for detailed instructions.

### 3. Run the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Server runs on `http://localhost:5000`

## 📁 Project Structure

```
backend/
├── config/           # Configuration files
│   ├── db.js         # MongoDB connection
│   └── cloudinary.js # Cloudinary setup
├── middleware/       # Express middleware
│   ├── auth.js       # JWT authentication
│   └── upload.js     # File upload handling
├── models/           # Mongoose schemas
│   ├── User.js       # User model with friends
│   ├── Chat.js       # Chat/Group model
│   └── Message.js    # Message model with reactions
├── routes/           # API routes
│   ├── auth.js       # Authentication endpoints
│   ├── users.js      # User profile & friends
│   └── messages.js   # Chat & messaging endpoints
├── server.js         # Main server & Socket.IO
├── package.json      # Dependencies
├── .env             # Environment variables (create from .env.example)
├── .env.example      # Template for environment variables
└── README.md         # This file
```

## 📚 API Endpoints

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

## 🔌 Socket.IO Events

### Client to Server (Emit)
- `join_chat` - Join a chat room
- `send_message` - Send a message with optional image/reply
- `add_reaction` - Add emoji reaction to message
- `typing` - Broadcast user is typing
- `stop_typing` - Broadcast user stopped typing

### Server to Client (Listen)
- `receive_message` - Receive new message
- `reaction_updated` - Message reaction updated
- `user_typing` - Another user is typing
- `user_stop_typing` - Another user stopped typing
- `message_error` - Error sending message
- `reaction_error` - Error adding reaction

## 🔐 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| MONGODB_URI | MongoDB connection string | `mongodb+srv://...` |
| JWT_SECRET | Secret for JWT tokens | Random secure string |
| CLOUDINARY_CLOUD_NAME | Cloudinary cloud name | `your_cloud_name` |
| CLOUDINARY_API_KEY | Cloudinary API key | `123456789` |
| CLOUDINARY_API_SECRET | Cloudinary API secret | Secret key |
| NODE_ENV | Environment | development/production |

## 🧪 Testing

Use Postman to test the API:

1. Set base URL to `http://localhost:5000`
2. Test endpoints documented in API Endpoints section above
3. Use tokens returned from login in Authorization headers

See [BACKEND_SETUP.md](./BACKEND_SETUP.md#testing-the-api) for cURL examples.

## 🚢 Deployment

Ready to deploy to:
- **Railway.app** ⭐ Recommended
- **Render.com**
- **Heroku**
- **AWS**
- **DigitalOcean**

See [BACKEND_SETUP.md](./BACKEND_SETUP.md#deployment) for deployment instructions.

## ⚠️ Security Notes

- Never commit `.env` file to git
- Keep `JWT_SECRET` secure and unique
- Use HTTPS in production
- Validate all user inputs
- Consider adding rate limiting
- Review Cloudinary API secret permissions

## 🐛 Troubleshooting

- **MongoDB Connection Error**: Verify connection string and IP whitelist
- **Port Already in Use**: Change PORT in `.env`
- **Cloudinary Upload Failed**: Check API credentials and file size (max 5MB)
- **CORS Errors**: Update origin in `server.js` if needed

See [BACKEND_SETUP.md](./BACKEND_SETUP.md#troubleshooting) for more help.

## 📖 Complete Documentation

For detailed setup instructions, API reference, and troubleshooting, see [BACKEND_SETUP.md](./BACKEND_SETUP.md).

## Free Tier Limitations

- Render free tier: Service sleeps after 15 minutes of inactivity
- MongoDB Atlas M0: 512 MB storage
- Cloudinary free: 25 monthly credits
