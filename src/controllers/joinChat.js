const getAllUsers = require('./getAllUsers');
const { setTimer } = require('../utils/timer');
const logger = require('../utils/logger');
const validator = require('../utils/validator');

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
  } else if (validator(user.username)) {
    socket.user = user;
    socket.emit('join-chat-success', user);
    socket.broadcast.emit('hello-there', user);
    /* istanbul ignore next */
    logger.info(
      `${socket.id} successfully joined chat with username - ${user.username}`
    );
    setTimer(socket, timeout);
  } else {
    /* istanbul ignore next */
    logger.error(`${socket.id} tried to join chat with invalid username`);
    socket.emit(
      'validation-error',
      'Username must contain only letters and numbers'
    );
  }
};

module.exports = joinChat;
