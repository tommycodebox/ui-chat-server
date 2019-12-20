const io = require('socket.io-client');
const ioServer = require('socket.io');

// Controllers
const connector = require('../src/controllers/connector');
const disconnector = require('../src/controllers/disconnector');
const getAllUsers = require('../src/controllers/getAllUsers');
const { timers } = require('../src/utils/timer');

describe('App', function() {
  let socket;
  let server;

  describe('connector()', () => {
    beforeEach(done => {
      server = ioServer(5000);
      server.on('connection', sock => connector(sock, server, 20000));
      server.on('disconnect', disconnector);
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
            takenSocket.on('username-taken', msg => {
              const users = getAllUsers(server);
              expect(users.length).toEqual(1);
              expect(msg).toEqual(
                'Unfortunately username Tom is already taken'
              );
              takenSocket.disconnect();
              done();
            });
            takenSocket.emit('join-chat', {
              id: takenSocket.id,
              username: 'Tom'
            });
          });
        });
      });
    });

    describe('newMessage()', () => {
      timers.length = 0;
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
        const tempSocket = io.connect('http://localhost:5000', {
          'reconnection delay': 0,
          'reopen delay': 0,
          'force new connection': true
        });
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

    describe('byeImLeaving()', () => {
      beforeEach(done => {
        // Setup
        socket = io.connect('http://localhost:5000', {
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
        if (socket.connected) {
          socket.disconnect();
        }
        done();
      });

      it('should emit `bye` event to other sockets', done => {
        const tempSocket = io.connect('http://localhost:5000', {
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
        const tempSocket = io.connect('http://localhost:5000', {
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
  });
});
