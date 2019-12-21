const joinChat = require('./joinChat');
const newMessage = require('./newMessage');
const byeImLeaving = require('./byeImLeaving');
const logger = require('../utils/logger');

const connector = (socket, io, timeout) => {
  logger.info(`Established new connection with ID ${socket.id}`);
  socket.on('join-chat', user => joinChat(user, socket, io, timeout));

  socket.on('new-message', msg => newMessage(msg, socket, timeout));

  socket.on('bye-im-leaving', () => byeImLeaving(socket));
};

module.exports = connector;
