const { clearTimer } = require('../utils/timer');
const logger = require('../utils/logger');

const newMessage = (msg, socket, timeout) => {
  if (msg.user === socket.user.username) {
    clearTimer(socket, timeout);
    /* istanbul ignore next */
    logger.info(`${socket.user.username}'s timer has been reset`);
  }
  socket.broadcast.emit('message', msg);
  /* istanbul ignore next */
  logger.info(
    `${socket.user.username} with ID ${socket.id} sent a new message - ${msg.text}`
  );
};

module.exports = newMessage;
