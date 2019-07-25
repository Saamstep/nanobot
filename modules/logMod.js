module.exports = function logEvent(event, reason, color, message, client) {
  const ConfigService = require('../config.js');

  let now = new Date();

  const embed = {
    color: color,
    footer: {
      // icon_url: client.user.avatarURL,
      // text: `${client.user.username} Action Logger`,
      timestamp: Date.now()
    },
    author: {
      name: `${event}`,
      icon_url: 'http://chittagongit.com/download/13059'
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

  let logchannel = message.guild.channels.find('name', `logger`);
  logchannel.send({ embed });
};
