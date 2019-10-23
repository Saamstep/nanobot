exports.run = async (client, message, args) => {
  const music = require('../MusicBot.js');
  const empty = '`The queue is currently empty!`';
  let q = music.getQueue();
  let msg = '';

  q.forEach(function(s) {
    msg += `- \`${s.title}\`\nRequested by:\n\`${s.addedBy}\`\n\n`;
  });
  if (msg == '') {
    msg += empty;
  }
  const embed = {
    color: 4825592,
    // thumbnail: {
    //   url: 'https://cdn.discordapp.com/embed/avatars/0.png'
    // },
    author: {
      name: 'MusicBot - Queue',
      icon_url: `${client.user.avatarURL}`
    },
    fields: [
      {
        name: 'Songs',
        value: msg
      }
    ]
  };

  message.channel.send({ embed });
};
