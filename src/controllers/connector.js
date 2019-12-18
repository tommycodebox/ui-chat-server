const disconnector = require('./disconnector');
const joinChat = require('./joinChat');

const connector = (socket, io) => {
  socket.on('join-chat', user => joinChat(user, socket, io));

  socket.on('new-message', msg => {
    socket.broadcast.emit('message', msg);
  });

  socket.on('diconnect', disconnector);
};

module.exports = connector;
