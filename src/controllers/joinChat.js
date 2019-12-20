const getAllUsers = require('./getAllUsers');
const { setTimer } = require('../utils/timer');

const joinChat = (user, socket, io) => {
  const users = getAllUsers(io);

  if (users.find(u => u.username === user.username)) {
    socket.emit(
      'username-taken',
      `Unfortunately username ${user.username} is already taken`
    );
  } else {
    socket.user = user;
    socket.emit('join-chat-success', user);

    setTimer(socket);
  }
};

module.exports = joinChat;
