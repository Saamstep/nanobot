exports.run = async (client, message, args) => {
  const music = require('../MusicBot.js');
  music.leave(message);
};
exports.cmd = {
  enabled: true,
  category: 'Utility',
  level: 0,
  description: 'Create a poll with a upvote/downvote choice.'
};