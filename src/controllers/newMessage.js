const { clearTimer } = require('../utils/timer');

const newMessage = (msg, socket) => {
  if (msg.user === socket.user.username) {
    clearTimer(socket);
  }
  socket.broadcast.emit('message', msg);
};

module.exports = newMessage;
