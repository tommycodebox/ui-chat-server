const ioServer = require('socket.io');
const io = require('socket.io-client');
const { timers } = require('../src/utils/timer');
const connector = require('../src/controllers/connector');

describe('timer()', () => {
  let server;
  let socket;

  beforeEach(done => {
    server = ioServer(4000);
    server.on('connection', sock => connector(sock, server, 500));
    timers.length = 0;
    // Setup
    socket = io.connect('http://localhost:4000', {
      'reconnection delay': 0,
      'reopen delay': 0,
      'force new connection': true
    });
    socket.on('connect', () => {
      socket.on('join-chat-success', () => {
        done();
      });
      socket.emit('join-chat', { id: socket.id, username: 'Tommy' });
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

  it('should add timer to timers array', done => {
    expect(timers.length).toEqual(1);
    done();
  });

  it('should emit AFK message to inactive user', done => {
    const tempSocket = io.connect('http://localhost:4000');
    tempSocket.on('connect', () => {
      tempSocket.on('join-chat-success', () => {
        tempSocket.on('AFK', msg => {
          expect(msg).toEqual('You have been disconnected due to inactivity');
          tempSocket.disconnect();
          done();
        });
      });
      tempSocket.emit('join-chat', { id: tempSocket.id, username: 'Temper' });
    });
  });

  it('should clear timer on new message', done => {
    const tempSocket = io.connect('http://localhost:4000');
    tempSocket.on('connect', () => {
      tempSocket.on('join-chat-success', user => {
        tempSocket.emit('new-message', { user: user.usernae });
        const clock = timers.find(t => t.user === user.username);
        const timer = { user: clock.user };
        expect(timer).toEqual({ user: user.username });
        done();
      });
      tempSocket.emit('join-chat', { id: tempSocket.id, username: 'Temper' });
    });
  });
});
