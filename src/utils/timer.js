const timers = [];

const setTimer = (socket, timeout) => {
  const timer = setTimeout(() => {
    socket.emit('AFK', 'You have been disconnected due to inactivity');
    socket.broadcast.emit('inactive-user', socket.user.username);
  }, timeout);

  timers.push({ user: socket.user.username, timer });
};

const clearTimer = (socket, timeout) => {
  const clock = timers.find(t => t.user === socket.user.username);
  if (clock) {
    clearTimeout(clock.timer);
    setTimer(socket, timeout);
  }
};

module.exports = {
  timers,
  setTimer,
  clearTimer
};
