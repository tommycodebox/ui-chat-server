const disconnector = require('./disconnector');
const joinChat = require('./joinChat');
const newMessage = require('./newMessage');

const connector = (socket, io) => {
  socket.on('join-chat', user => joinChat(user, socket, io));

  socket.on('new-message', msg => newMessage(msg, socket));

  socket.on('bye-im-leaving', () => {
    socket.broadcast.emit('bye', socket.user);
    delete socket.user;
  });

  socket.on('disconnect', () => disconnector(socket));
};

module.exports = connector;
