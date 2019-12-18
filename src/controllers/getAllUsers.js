const getAll = io =>
  Object.keys(io.sockets.sockets)
    .map(id => io.sockets.sockets[id].user)
    .filter(s => s);

module.exports = getAll;
