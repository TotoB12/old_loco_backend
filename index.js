const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const PORT = process.env.PORT || 3000;

const users = [];

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('join', ({ id, location }) => {
    const user = { id, name: '', location };
    users.push(user);
    io.emit('users', users);
  });

  socket.on('location', ({ id, location }) => {
    const user = users.find((user) => user.id === id);
    if (user) {
      user.location = location;
      io.emit('users', users);
    }
  });

  socket.on('updateName', ({ id, name }) => {
    const user = users.find((user) => user.id === id);
    if (user) {
      user.name = name;
      io.emit('users', users);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
    const user = users.find((user) => user.id === socket.id);
    if (user) {
      users.splice(users.indexOf(user), 1);
      io.emit('users', users);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
