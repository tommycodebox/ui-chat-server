const io = require('socket.io-client');
const ioServer = require('socket.io');

// Controllers
const connector = require('../src/controllers/connector');
const getAllUsers = require('../src/controllers/getAllUsers');

describe('newMessage()', () => {
  let socket;
  let server;
  beforeEach(done => {
    // Setup
    server = ioServer(5003);
    server.on('connection', sock => connector(sock, server, 5000));
    socket = io.connect('http://localhost:5003', {
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

  it('should emit `bye` event to other sockets', done => {
    const tempSocket = io.connect('http://localhost:5003', {
      'reconnection delay': 0,
      'reopen delay': 0,
      'force new connection': true
    });
    tempSocket.on('connect', () => {
      tempSocket.on('bye', user => {
        expect(user).toEqual({ id: socket.id, username: 'Tom' });
        tempSocket.disconnect();
        done();
      });
      socket.emit('bye-im-leaving', 'Tom');
    });
  });
  it('should remove user that left from users list', done => {
    const tempSocket = io.connect('http://localhost:5003', {
      'reconnection delay': 0,
      'reopen delay': 0,
      'force new connection': true
    });
    tempSocket.on('connect', () => {
      tempSocket.on('bye', () => {
        const users = getAllUsers(server);
        expect(users.length).toEqual(0);
        done();
      });
      socket.emit('bye-im-leaving', 'Tom');
    });
  });
});
