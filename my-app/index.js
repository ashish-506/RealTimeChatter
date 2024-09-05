const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const socketio = require('socket.io');

const app = express();
const server = require('http').Server(app);
const io = socketio(server, {
  cors: {
    origin: "http://localhost:3000", // Your client-side origin
    methods: ["GET", "POST"]
  }
});

dotenv.config();
const port = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB connection established successfully');
});

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
const messagesRouter = require('./routes/messages');
app.use('/messages', messagesRouter);

// Start server
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Socket.IO
io.on('connection', (socket) => {
  console.log(`Socket ${socket.id} connected`);

  socket.on('sendMessage', (message) => {
    io.emit('message', message);
  });

  socket.on('disconnect', () => {
    console.log(`Socket ${socket.id} disconnected`);
  });
});