const timers = [];

const setTimer = (socket, time) => {
  const timer = setTimeout(() => {
    socket.emit('AFK', 'You have been disconnected due to inactivity');
    socket.broadcast.emit('inactive-user', socket.user.username);
  }, time);

  timers.push({ user: socket.user.username, timer });
};

const clearTimer = socket => {
  const clock = timers.find(t => t.user === socket.user.username);
  if (clock) {
    clearTimeout(clock.timer);
    setTimer(socket);
  }
};

module.exports = {
  timers,
  setTimer,
  clearTimer
};
