const express = require('express');
const app = express();
const path = require('path');

const http = require('http');
const socket = require('socket.io');

const server = http.createServer(app);
const io = socket(server);

io.on('connection', socket => {
  console.log('connected');
  socket.on('send-location', data => {
    io.emit('receive-location', { id: socket.id, ...data });
  });

  socket.on('disconnect', () => {
    io.emit('user-disconnected', socket.id);
  });
});

app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

server.listen(3000);
