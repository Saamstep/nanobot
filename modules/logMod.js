module.exports = function logEvent(event, reason, color, message) {
  const ConfigService = require('../config.js');

  var dateFormat = require('dateformat');
  let now = new Date();
  let timeFormat = dateFormat(now, 'dddd, mmmm dS, yyyy, h:MM:ss TT');

  const embed = {
    color: color,
    footer: {
      icon_url: 'http://logonoid.com/images/mod-logo.png',
      text: `${ConfigService.config.serverName} Action Logger`
    },
    author: {
      name: `${event}`,
      icon_url: 'http://logonoid.com/images/mod-logo.png'
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

  let guild = message.guild;

  let logchannel = guild.channels.find('name', `${ConfigService.config.log}`);
  logchannel.send({ embed });
};
