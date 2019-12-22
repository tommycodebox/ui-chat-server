const joinChat = require('./joinChat');
const hmUsers = require('./hmUsers');
const newMessage = require('./newMessage');
const byeImLeaving = require('./byeImLeaving');
const getAllUsers = require('./getAllUsers');
const logger = require('../utils/logger');

const connector = (socket, io, timeout) => {
  logger.info(`Established new connection with ID ${socket.id}`);

  socket.on('join-chat', user => joinChat(user, socket, io, timeout));

  socket.on('hm-users', () => hmUsers(socket, io));

  socket.on('new-message', msg => newMessage(msg, socket, timeout));

  socket.on('bye-im-leaving', () => byeImLeaving(socket));

  const users = getAllUsers(io);
};

module.exports = connector;
