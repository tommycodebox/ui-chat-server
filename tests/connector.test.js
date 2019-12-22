const io = require('socket.io-client');
const ioServer = require('socket.io');

// Controllers
const connector = require('../src/controllers/connector');

describe('connector()', () => {
  let socket;
  let server;
  beforeEach(done => {
    server = ioServer(5000);
    server.on('connection', sock => connector(sock, server, 5000));
    // Setup
    socket = io.connect('http://localhost:5000');
    socket.on('connect', () => {
      done();
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

  it('should connect new socket instance', done => {
    expect(Object.keys(server.sockets.sockets).length).toEqual(1);
    done();
  });
  it('should connect more than 1 socket instance', done => {
    // Setup
    const tempSocket = io.connect('http://localhost:5000');
    tempSocket.on('connect', () => {
      expect(Object.keys(server.sockets.sockets).length).toEqual(2);

      tempSocket.disconnect();
      done();
    });
  });
});
