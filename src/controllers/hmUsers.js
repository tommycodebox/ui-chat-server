const getAllUsers = require('./getAllUsers');

const hmUsers = (socket, io) => {
  const users = getAllUsers(io);
  socket.emit('connected-users', users);
};

module.exports = hmUsers;
