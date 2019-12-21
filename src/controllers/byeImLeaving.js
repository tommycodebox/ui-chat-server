const { removeTimer } = require('../utils/timer');
const logger = require('../utils/logger');

const byeImLeaving = socket => {
  socket.broadcast.emit('bye', socket.user);
  removeTimer(socket);
  /* istanbul ignore next */
  logger.info(
    `${socket.user.username} with ID ${socket.id} just left the chat`
  );
  delete socket.user;
};

module.exports = byeImLeaving;
