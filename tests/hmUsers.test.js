const io = require('socket.io-client');
const ioServer = require('socket.io');

// Controllers
const connector = require('../src/controllers/connector');

describe('joinChat()', () => {
  let socket;
  let server;
  beforeEach(done => {
    // Setup
    server = ioServer(5004);
    server.on('connection', sock => connector(sock, server, 5000));
    socket = io.connect('http://localhost:5004', {
      'reconnection delay': 0,
      'reopen delay': 0,
      'force new connection': true
    });
    socket.on('connect', () => {
      socket.on('join-chat-success', () => {
        done();
      });
      socket.emit('join-chat', { id: socket.id, username: 'Tom' });
    });
    socket.on('disconnect', () => {
      done();
    });
  });
  afterEach(done => {
    // Cleanup
    server.close();
    if (socket.connected) {
      socket.disconnect();
    }
    done();
  });

  it('should respond with all users connected', done => {
    socket.on('connected-users', users => {
      expect(users.length).toEqual(1);
      done();
    });
    socket.emit('hm-users');
  });
});
