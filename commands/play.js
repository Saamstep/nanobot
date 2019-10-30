exports.run = async (client, message, args) => {
  const music = require('../MusicBot.js');
  if (!args[0] || !args[0].includes('youtube.com/')) return;
  let song = await music.getSongInfo(args[0], message);

  if (music.vc(message)) {
    // client.user.member.setDeaf(true);
    music.addToQueue(message, song);

    if (music.getPlayStatus() == false) {
      music.play(message);
      console.log('Ran status false');
    }
  } else {
    client.error('Please join a voice channel!', message);
  }
};
exports.cmd = {
  enabled: true,
  category: 'Utility',
  level: 0,
  description: 'Create a poll with a upvote/downvote choice.'
};