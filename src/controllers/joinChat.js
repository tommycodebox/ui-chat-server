const getAllUsers = require('./getAllUsers');
const { setTimer } = require('../utils/timer');
const logger = require('../utils/logger');

const joinChat = (user, socket, io, timeout) => {
  const users = getAllUsers(io);
  if (users.find(u => u.username === user.username)) {
    socket.emit(
      'username-taken',
      `Unfortunately username ${user.username} is already taken`
    );
    /* istanbul ignore next */
    logger.error(
      `${socket.id} tried to join chat chat with taken username - ${user.username}`
    );
  } else {
    socket.user = user;
    socket.emit('join-chat-success', user);
    /* istanbul ignore next */
    logger.info(
      `${socket.id} successfully joined chat chat with username - ${user.username}`
    );
    setTimer(socket, timeout);
  }
};

module.exports = joinChat;
