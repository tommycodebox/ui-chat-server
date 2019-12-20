const { removeTimer } = require('../utils/timer');

const byeImLeaving = socket => {
  socket.broadcast.emit('bye', socket.user);
  removeTimer(socket);
  delete socket.user;
};

module.exports = byeImLeaving;
