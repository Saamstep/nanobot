exports.run = (client, member, message) => {
  var config = require('../config.json');

  let reason = GuildAuditLogsEntry.reason();
  const embed = {
    color: 13632027,
    timestamp: '2018-02-23T20:06:55.686Z',
    footer: {
      icon_url: 'http://logonoid.com/images/mod-logo.png',
      text: `${config.serverName} Action Logger`
    },
    author: {
      name: `Ban Added`,
      icon_url: 'http://logonoid.com/images/mod-logo.png'
    },
    fields: [
      {
        name: 'Reason',
        value: `${reason}`
      }
    ]
  };

  var dateFormat = require('dateformat');
  let now = new Date();
  let timeFormat = dateFormat(now);

  let logchannel = client.channels.find('name', `${config.log}`);
  logchannel.send({ embed });
};
