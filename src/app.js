const PORT = process.env.NODE_ENV === 'production' ? 80 : 5000;
const io = require('socket.io')(PORT);
const connector = require('./controllers/connector');

const DEFAULT_TIMEOUT = 10000;

io.on('connection', socket => connector(socket, io, DEFAULT_TIMEOUT));

process.on('SIGINT', () => {
  console.log('---Closing active connections---');
  io.close();
  process.exit(1);
});
process.on('SIGTERM', () => {
  console.log('---Closing active connections---');
  io.close();
  process.exit(1);
});
