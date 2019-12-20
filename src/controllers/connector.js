const disconnector = require('./disconnector');
const joinChat = require('./joinChat');
const newMessage = require('./newMessage');
const byeImLeaving = require('./byeImLeaving');

const connector = (socket, io) => {
  socket.on('join-chat', user => joinChat(user, socket, io));

  socket.on('new-message', msg => newMessage(msg, socket));

  socket.on('bye-im-leaving', () => byeImLeaving(socket));

  socket.on('disconnect', () => disconnector(socket));
};

module.exports = connector;
