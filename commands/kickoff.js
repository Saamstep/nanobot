const ConfigService = require('../config.js');
const isOwner = require('../modules/isOwner.js');
const moment = require('moment');

exports.run = (client, message, args) => {
  const cooldown = require('../index.js');
  function cmd() {
    const kickoff = moment(ConfigService.config.kickoff);

    if (args[0] === 'set' && isOwner(message)) {
      // See if the input date is valid and if so, set it in the config file
      const inputDate = moment(args[1], 'MM/DD/YYYY', true);
      if (inputDate.isValid()) {
        ConfigService.setConfigProperty('kickoff', inputDate.toISOString());
        message.channel.send('Set FRC kick-off to ' + args[1]);
      } else {
        message.reply(`The date ${args[1]} is not in the format \`MM/DD/YYYY\``)
      }
    } else {
      const now = moment();
      const daysTill = kickoff.diff(now, 'days');

      if (daysTill == 0) {
        message.channel.send('Kick-off is today!');
      } else if (daysTill < 0) {
        message.channel.send(Math.abs(daysTill) + ' days since kick-off happened');
      } else {
        message.channel.send(Math.abs(now.diff(kickoff, 'days')) + 1 + ' days left till kick-off');
      }
    }
  }
  cooldown(message, cmd);
};

exports.description = 'Countdown to FRC kick-off';