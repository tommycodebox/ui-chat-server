const io = require('socket.io')(5000);
const connector = require('./controllers/connector');

const DEFAULT_TIMEOUT = 30000;

io.on('connection', socket => connector(socket, io, DEFAULT_TIMEOUT));

module.exports = io;
