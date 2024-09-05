import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './App.css'; // Import the CSS file for styling

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
    <div className="chat-app">
      <header className="chat-header">
        <i className="fas fa-comments"></i> Real-Time Chat
      </header>
      <div className="chat-container">
        <div className="chat-box">
          <ul className="message-list">
            {messages.map((message, index) => (
              <li key={index} className="message-item">
                <strong>{message.name}:</strong> {message.message}
              </li>
            ))}
          </ul>
        </div>
        <form className="message-form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="input-name"
            value={name}
            placeholder="Your name"
            onChange={(event) => setName(event.target.value)}
          />
          <input
            type="text"
            className="input-message"
            value={message}
            placeholder="Your message"
            onChange={(event) => setMessage(event.target.value)}
          />
          <button type="submit" className="send-button">Send</button>
        </form>
      </div>
    </div>
  );
}

export default App;
