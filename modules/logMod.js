module.exports = function logEvent(event, reason, color, message, client) {
  const ConfigService = require('../config.js');

  let now = new Date();

  const embed = {
    color: color,
    footer: {
      icon_url: client.user.avatarURL,
      text: `${client.user.username} Action Logger`,
      timestamp: Date.now()
    },
    author: {
      name: `${event}`,
      icon_url: 'https://icon-library.net/images/administrator-icon/administrator-icon-1.jpg'
    },
    fields: [
      {
        name: 'Reason',
        value: `${reason}`
      },
      {
        name: 'Executed By',
        value: `${message.author}`
      }
    ]
  };

  let logchannel = message.guild.channels.find(ch => ch.name == `logger`);
  logchannel.send({ embed });
};
