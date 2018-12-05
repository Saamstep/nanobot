module.exports = function logEvent(event, reason, color, message) {
  const ConfigService = require('../config.js');

  const embed = {
    color: color,
    timestamp: '2018-02-23T20:06:55.686Z',
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
  var dateFormat = require('dateformat');
  let now = new Date();
  let timeFormat = dateFormat(now);

  let logchannel = guild.channels.find('name', `${ConfigService.config.log}`);
  logchannel.send({ embed });
};
