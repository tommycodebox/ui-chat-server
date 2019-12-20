const { timeLeft } = require('./joinChat');

const byeImLeaving = socket => {
  clearTimeout(timeLeft);
  socket.broadcast.emit('bye', socket.user);
  delete socket.user;
};

module.exports = byeImLeaving;
