const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const escapeHTML = require('escape-html');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;
const users = {
  "102401e3-e8ef-4ff4-8477-41bd992a1edc": {
    id: "102401e3-e8ef-4ff4-8477-41bd992a1edc",
    name: "",
    location: {
      speed: 0,
      altitudeAccuracy: 0.5,
      latitude: 37.2964517,
      heading: 90,
      altitude: 0,
      longitude: -122.0306383,
      accuracy: 5,
    },
  },
};

io.on('connection', (socket) => {
  console.log('New client connected', socket.id);

  socket.on('join', ({ id, location }) => {
    users[id] = { id: socket.id, name: '', location };
    io.emit('users', users);
  });

  socket.on('location', ({ id, location }) => {
    console.log("User joined");
    if (users[id]) {
      users[id].location = location;
      console.log(users);
      io.emit('users', users);
    }
  });

  socket.on('updateName', ({ id, name }) => {
    if (users[id]) {
      users[id].name = escapeHTML(name);
      io.emit('users', users);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected', socket.id);
    Object.keys(users).forEach((userId) => {
      if (users[userId].socketId === socket.id) {
        delete users[userId];
        io.emit('users', users);
      }
    });
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
