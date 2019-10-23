exports.run = async (client, message, args) => {
  const music = require('../MusicBot.js');
  music.leave(message);
};
