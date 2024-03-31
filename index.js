const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const PORT = process.env.PORT || 3000;

const locations = [];

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('location', (coords) => {
    locations.push(coords);
    io.emit('locations', locations);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
