const ConfigService = require('../config.js');
const moment = require('moment');

exports.run = (client, message, args) => {
  const kickoff = moment(ConfigService.config.kickoff);

  if (args[0] === 'set') {
    const inputDate = moment(args[1], 'MM/DD/YYYY', true);
    if (inputDate.isValid()) {
      ConfigService.setConfigProperty('kickoff', inputDate.toISOString());
      message.channel.send('Set FRC kick-off to ' + args[1]);
    } else {
      message.reply(`The date ${args[1]} is not in the format \`MM/DD/YYYY\``)
    }
  } else {
    const now = moment();
    message.channel.send(Math.abs(now.diff(kickoff, 'days')) + 1 + ' days left till kick-off');
  }
};
  
exports.description = 'Countdown to FRC kick-off';