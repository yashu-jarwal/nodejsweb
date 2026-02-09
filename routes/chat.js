const express = require('express');
const router = express.Router();
const users = {}; // socket.id => username
// WebSocket connection
io.on('connection', (socket) => {

  socket.on('set username', (username) => {
    users[socket.id] = username;
      console.log('✅ User connected:', username);

    // Notify others
    socket.broadcast.emit('user joined', username);

    // Send updated user list
    io.emit('user list', Object.values(users));
  });

  socket.on('chat message', (message) => {
    const username = users[socket.id] || 'Guest';
    io.emit('chat message', { username, message });
  });

  socket.on('disconnect', () => {
    const username = users[socket.id];
    delete users[socket.id];
    
    if (username) {
      io.emit('user left', username);
    }

    io.emit('user list', Object.values(users));
    console.log(`❌ ${username} disconnected`);
  });
});

module.exports = { router, socketHandler };
