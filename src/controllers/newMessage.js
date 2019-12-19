const newMessage = (msg, socket) => {
  socket.broadcast.emit('message', msg);
};

module.exports = newMessage;
