# Real-Time Chatter

## Introduction

Real-time chat applications are increasingly popular, and building one using the MERN stack and Socket.IO is an excellent way to learn about real-time applications. This project demonstrates how to create a real-time chat application from scratch using MongoDB, Express.js, React.js, Node.js, and Socket.IO.

## Features

- Real-time messaging with Socket.IO
- User-friendly frontend built with React.js
- Persistent message storage using MongoDB

## Technology Stack

- **MongoDB**: NoSQL database for storing chat messages
- **Express.js**: Web framework for Node.js to build RESTful API
- **React.js**: Frontend library for building the user interface
- **Node.js**: Server-side runtime environment
- **Socket.IO**: Library for real-time, bidirectional communication

## Setting Up the Backend

Follow these steps to set up the backend of the application:

1. **Install Node.js and MongoDB**: Ensure both are installed on your machine.

2. **Create a New Project Folder**:
    ```bash
    mkdir real-time-chat
    cd real-time-chat
    ```

3. **Initialize the Project**:
    ```bash
    npm init -y
    ```

4. **Install Dependencies**:
    ```bash
    npm install express mongoose socket.io cors dotenv
    ```

5. **Create `index.js`**:
    ```javascript
    const express = require('express');
    const mongoose = require('mongoose');
    const cors = require('cors');
    const dotenv = require('dotenv');
    const socketio = require('socket.io');

    const app = express();
    const server = require('http').Server(app);
    const io = socketio(server);

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
    ```

## Creating the Frontend

Follow these steps to set up the frontend of the application:

1. **Create a New React App**:
    ```bash
    npx create-react-app my-app
    cd my-app
    ```

2. **Install Dependencies**:
    ```bash
    npm install socket.io-client
    ```

3. **Edit `src/App.js`**:
    ```javascript
    import React, { useState, useEffect } from 'react';
    import io from 'socket.io-client';

    const socket = io('http://localhost:5000');

    function App() {
      const [name, setName] = useState('');
      const [message, setMessage] = useState('');
      const [messages, setMessages] = useState([]);

      useEffect(() => {
        socket.on('message', (message) => {
          setMessages((messages) => [...messages, message]);
        });
      }, []);

      const handleSubmit = (event) => {
        event.preventDefault();
        if (name && message) {
          socket.emit('sendMessage', { name, message });
          setName('');
          setMessage('');
        }
      };

      return (
        <div>
          <form onSubmit={handleSubmit}>
            <input type="text" value={name} placeholder="Your name" onChange={(event) => setName(event.target.value)} />
            <input type="text" value={message} placeholder="Your message" onChange={(event) => setMessage(event.target.value)} />
            <button type="submit">Send</button>
          </form>
          <ul>
            {messages.map((message, index) => (
              <li key={index}>
                {message.name}: {message.message}
              </li>
            ))}
          </ul>
        </div>
      );
    }

    export default App;
    ```

## Running the Application

1. **Start the Backend**:
    ```bash
    node index.js
    ```

2. **Start the Frontend**:
    ```bash
    npm start
    ```

## Conclusion

This project demonstrates how to build a real-time chat application using the MERN stack and Socket.IO. By following this guide, you should gain a solid understanding of real-time communication and full-stack development.

Feel free to contribute to this project or use it as a foundation for your own applications.

## License

[MIT License](LICENSE)
