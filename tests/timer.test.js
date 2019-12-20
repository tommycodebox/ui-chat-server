const ioServer = require('socket.io');
const io = require('socket.io-client');
const { timers } = require('../src/utils/timer');
const connector = require('../src/controllers/connector');
const disconnector = require('../src/controllers/disconnector');

describe('timer()', () => {
  let server;
  let socket;
  beforeAll(() => {
    server = ioServer(4000);
    server.on('connection', sock => connector(sock, server, 3000));
    server.on('disconnect', disconnector);
  });

  afterAll(() => {
    server.close();
  });

  beforeEach(done => {
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
    if (socket.connected) {
      socket.disconnect();
    }
    done();
  });

  it('should add timer to timers array', done => {
    expect(timers.length).toEqual(1);
    done();
  });
  // it('should receive message about being disconnected', done => {
  //   socket.on('AFK', msg => {
  //     expect(msg).toEqual('You have been disconnected due to inactivity');
  //     done();
  //   });
  // });
});
