const io = require('socket.io')(5000);
const connector = require('./controllers/connector');

io.on('connection', socket => connector(socket, io));

module.exports = io;
