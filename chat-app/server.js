const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

const users = {};

io.on('connection', (socket) => {
  socket.on('new user', (nickname) => {
    users[socket.id] = nickname;
    socket.broadcast.emit('user joined', nickname);
  });

  socket.on('chat message', (message) => {
    const nickname = users[socket.id];
    // const timestamp = new Date().toLocaleTimeString();
    // const formattedMessage = `[${timestamp}] ${nickname}: ${message}`;
    const formattedMessage = `[ ${nickname}: ${message}`;
    io.emit('chat message', formattedMessage);
  });

  socket.on('disconnect', () => {
    const nickname = users[socket.id];
    delete users[socket.id];
    socket.broadcast.emit('user left', nickname);
  });
});

http.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
