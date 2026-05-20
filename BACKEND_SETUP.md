# Hive Backend Setup Guide

## Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account (free) or local MongoDB
- Cloudinary account (free) if you want image uploads
- Git

## Installation Steps

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the backend folder with the following credentials:

#### MongoDB Setup
You can use MongoDB Atlas or a local MongoDB instance.

##### MongoDB Atlas Setup
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account and cluster
3. Click "Connect" and get your connection string
4. Replace `username`, `password`, and `cluster` in your MongoDB URI:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hive?retryWrites=true&w=majority
```

##### Local MongoDB Setup
If you have MongoDB installed locally, leave `MONGODB_URI` blank in `.env` and the backend will connect to:
```
mongodb://127.0.0.1:27017/hive
```

#### JWT Secret
Generate a random secure string:
```bash
# On Mac/Linux
openssl rand -base64 32

# On Windows PowerShell
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes([System.Guid]::NewGuid().ToString())) | Out-String -NoNewline
```

Set this in `.env`:
```
JWT_SECRET=your_generated_key_here
```

#### Cloudinary Setup
1. Go to https://cloudinary.com/users/register/free
2. Sign up for a free account
3. Go to Dashboard and copy:
   - Cloud Name
   - API Key
   - API Secret (keep this private!)

Add these to `.env`:
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints Reference

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login with email/mobile and password

### Users
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/profile/photo` - Upload profile photo
- `GET /api/users/all` - Get all users
- `POST /api/users/friends/:friendId` - Add friend
- `GET /api/users/friends` - Get friends list
- `DELETE /api/users/friends/:friendId` - Remove friend

### Messages & Chats
- `GET /api/messages/:chatId` - Get messages for a chat
- `POST /api/messages/upload-image` - Upload image to chat
- `DELETE /api/messages/:messageId/delete-for-me` - Delete message for yourself
- `DELETE /api/messages/:messageId/delete-for-everyone` - Delete message for all
- `POST /api/messages/chat` - Create or get a chat
- `GET /api/messages/chats/all` - Get all chats for user

## Real-Time Features (Socket.IO)

### Client-side Socket Events

**Emit:**
- `join_chat(chatId)` - Join a chat room
- `send_message(data)` - Send a message
  ```js
  {
    chatId: string,
    senderId: userId,
    content: string,
    messageType: 'text' | 'image',
    imageUrl?: string,
    replyTo?: messageId
  }
  ```
- `add_reaction(data)` - Add reaction to message
  ```js
  { messageId, userId, emoji }
  ```
- `typing(data)` - Indicate user is typing
  ```js
  { chatId, userId, userName }
  ```
- `stop_typing(data)` - Stop typing indicator
  ```js
  { chatId, userId }
  ```

**Listen:**
- `receive_message(message)` - New message received
- `reaction_updated(message)` - Message reaction updated
- `user_typing(data)` - User typing in chat
- `user_stop_typing(data)` - User stopped typing
- `message_error(error)` - Message sending error
- `reaction_error(error)` - Reaction error

## Troubleshooting

### MongoDB Connection Error
- Check your MongoDB URI in `.env`
- Make sure your IP address is whitelisted in MongoDB Atlas
- Verify username/password are correct

### Cloudinary Upload Errors
- Verify API credentials are correct
- Check that image file size is under 5MB
- Ensure only image files (JPEG, PNG, GIF) are uploaded

### Port Already in Use
Change the `PORT` in `.env` or kill the process using port 5000:
```bash
# On Windows PowerShell
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process

# On Mac/Linux
lsof -ti:5000 | xargs kill -9
```

### CORS Errors
The backend is configured to accept requests from any origin (`origin: '*'`). If you want to restrict it, modify `server.js` to specify your frontend URL.

## Testing the API

### Using cURL
```bash
# Sign up
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "mobileNumber": "1234567890",
    "password": "password123"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "emailOrMobile": "john@example.com",
    "password": "password123"
  }'
```

### Using Postman
1. Import the provided Postman collection (if available)
2. Set base URL to `http://localhost:5000`
3. Use the token from login in Authorization headers

## Deployment

### To deploy to Heroku:
1. Add `Procfile` with: `web: npm start`
2. Set environment variables in Heroku dashboard
3. Deploy using: `heroku git:push heroku main`

### To deploy to other platforms:
- Vercel: Not suitable for Node.js backend
- Railway.app: Add `Procfile` and deploy
- Render: Connect GitHub repo and deploy
- AWS/DigitalOcean: Standard Node.js deployment

## Next Steps
- Set up frontend connection to this backend
- Add input validation and error handling
- Implement rate limiting
- Add logging and monitoring
- Set up CI/CD pipeline
