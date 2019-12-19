const io = require('socket.io-client');
const ioServer = require('socket.io');

// Controllers
const connector = require('../src/controllers/connector');
const getAllUsers = require('../src/controllers/getAllUsers');

describe('App', function() {
  let socket;
  let server;

  beforeAll(() => {
    server = ioServer(5000);
    server.on('connection', sock => connector(sock, server));
  });

  afterAll(() => {
    server.close();
  });

  describe('connector()', () => {
    beforeEach(done => {
      // Setup
      socket = io.connect('http://localhost:5000', {
        'reconnection delay': 0,
        'reopen delay': 0,
        'force new connection': true
      });
      socket.on('connect', () => {
        done();
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

    it('should connect new socket instance', done => {
      expect(Object.keys(server.sockets.sockets).length).toEqual(1);
      done();
    });
    it('should connect more than 1 socket instance', done => {
      // Setup
      const tempSocket = io.connect('http://localhost:5000', {
        'reconnection delay': 0,
        'reopen delay': 0,
        'force new connection': true
      });
      tempSocket.on('connect', () => {
        expect(Object.keys(server.sockets.sockets).length).toEqual(2);

        tempSocket.disconnect();
        done();
      });
    });

    describe('joinChat()', () => {
      beforeEach(done => {
        // Setup
        socket = io.connect('http://localhost:5000', {
          'reconnection delay': 0,
          'reopen delay': 0,
          'force new connection': true
        });
        socket.on('connect', () => {
          done();
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

      it('should join chat with unique username', done => {
        socket.emit('join-chat', { id: 1, username: 'Tom' });
        socket.on('join-chat-success', user => {
          const users = getAllUsers(server);
          expect(users.find(u => u.username === user.username)).toEqual({
            id: 1,
            username: 'Tom'
          });
          done();
        });
      });
      it('should decline joining chat with taken username', done => {
        socket.emit('join-chat', { id: socket.id, username: 'Tom' });

        socket.on('join-chat-success', () => {
          const takenSocket = io.connect('http://localhost:5000', {
            'reconnection delay': 0,
            'reopen delay': 0,
            'force new connection': true
          });
          takenSocket.on('connect', () => {
            takenSocket.emit('join-chat', {
              id: takenSocket.id,
              username: 'Tom'
            });

            takenSocket.on('username-taken', msg => {
              const users = getAllUsers(server);
              expect(users.length).toEqual(1);
              expect(msg).toEqual(
                'Unfortunately username Tom is already taken'
              );
              takenSocket.close();
              done();
            });
          });
        });
      });
    });

    describe('newMessage()', () => {
      beforeEach(done => {
        // Setup
        socket = io.connect('http://localhost:5000', {
          'reconnection delay': 0,
          'reopen delay': 0,
          'force new connection': true
        });
        socket.on('connect', () => {
          done();
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
      it('should accept and redirect new message to all connected sockets', done => {
        const tempSocket = io.connect('http://localhost:5000', {
          'reconnection delay': 0,
          'reopen delay': 0,
          'force new connection': true
        });
        socket.on('message', msg => {
          expect(msg).toEqual({ user: 'Tom', text: 'Hello' });
          done();
        });
        tempSocket.on('connect', () => {
          tempSocket.emit('new-message', { user: 'Tom', text: 'Hello' });
        });
      });
    });
  });
});
