const io = require('socket.io-client');
const ioServer = require('socket.io');

// Controllers
const connector = require('../src/controllers/connector');
const getAllUsers = require('../src/controllers/getAllUsers');

describe('joinChat()', () => {
  let socket;
  let server;
  beforeEach(done => {
    // Setup
    server = ioServer(5001);
    server.on('connection', sock => connector(sock, server, 5000));
    socket = io.connect('http://localhost:5001');
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

  it('should join chat with unique username', done => {
    const tempSocket = io.connect('http://localhost:5001');
    tempSocket.on('connect', () => {
      tempSocket.on('join-chat-success', user => {
        const users = getAllUsers(server);
        expect(users.find(u => u.username === user.username)).toEqual({
          id: socket.id,
          username: 'Tommy'
        });
        tempSocket.disconnect();
        done();
      });
      tempSocket.emit('join-chat', { id: socket.id, username: 'Tommy' });
    });
  });
  it('should decline joining chat with taken username', done => {
    const tempSocket = io.connect('http://localhost:5001');
    tempSocket.on('connect', () => {
      tempSocket.on('username-taken', msg => {
        const users = getAllUsers(server);
        expect(users.length).toEqual(1);
        expect(msg).toEqual('Unfortunately username Tom is already taken');
        tempSocket.disconnect();
        done();
      });
      tempSocket.emit('join-chat', {
        id: tempSocket.id,
        username: 'Tom'
      });
    });
  });
  it('should reject joining chat and return error if passed invalid username', done => {
    const tempSocket = io.connect('http://localhost:5001');
    tempSocket.on('connect', () => {
      tempSocket.on('validation-error', error => {
        expect(error).toEqual('Username must contain only letters and numbers');
        tempSocket.disconnect();
        done();
      });
      tempSocket.emit('join-chat', {
        id: tempSocket.id,
        username: '$^#@TOM()#%'
      });
    });
  });
});
