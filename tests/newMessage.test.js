const io = require('socket.io-client');
const ioServer = require('socket.io');

// Controllers
const connector = require('../src/controllers/connector');
const { timers } = require('../src/utils/timer');

describe('newMessage()', () => {
  let socket;
  let server;
  beforeEach(done => {
    // Setup
    server = ioServer(5002);
    server.on('connection', sock => connector(sock, server, 5000));
    socket = io.connect('http://localhost:5002');
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

  it('should accept and redirect new message to all connected sockets', done => {
    const tempSocket = io.connect('http://localhost:5002');
    tempSocket.on('connect', () => {
      tempSocket.on('join-chat-success', () => {
        socket.on('message', msg => {
          expect(msg).toEqual({ user: 'Tom', text: 'Hello' });
          tempSocket.disconnect();
          done();
        });
        tempSocket.emit('new-message', { user: 'Tom', text: 'Hello' });
      });
      tempSocket.emit('join-chat', { id: socket.id, username: 'First' });
    });
  });
  it('should reset the timer on new message from user', done => {
    const tempSocket = io.connect('http://localhost:5002');
    tempSocket.on('connect', () => {
      tempSocket.on('join-chat-success', () => {
        socket.on('message', () => {
          let timer = timers.find(t => t.user === 'Tom');
          timer = { user: timer.user };
          expect(timer).toEqual({ user: 'Tom' });
          tempSocket.disconnect();
          done();
        });
        tempSocket.emit('new-message', { user: 'Tom', text: 'Hello' });
      });
      tempSocket.emit('join-chat', {
        id: tempSocket.id,
        username: 'Someone'
      });
    });
  });
});
