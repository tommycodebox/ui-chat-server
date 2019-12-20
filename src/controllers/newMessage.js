const { clearTimer } = require('../utils/timer');

const newMessage = (msg, socket, timeout) => {
  if (msg.user === socket.user.username) {
    clearTimer(socket, timeout);
  }
  socket.broadcast.emit('message', msg);
};

module.exports = newMessage;
