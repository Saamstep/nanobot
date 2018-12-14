// hi
exports.run = (client, message, args) => {
  const ConfigService = require('../config.js');
  let command = message.content.split(' ')[0];
  command = command.slice(config.prefix.length);
  const error = require('../modules/errorMod.js');

  const testFolder = './commands/';
  const ccFolder = './commands/cc/';
  const fs = require('fs');
  var path = '../NanoBot/commands.txt';
  let option = args[1];

  var msg = fs.readFileSync('./commands.txt', 'utf8');

  message.react('🖨');

  if (args[0] === 'here') {
    return message.channel.send('Bot Commands:\n\n' + msg, {
      code: 'utf8'
    });
  } else {
    return message.author.send('Bot Commands:\n\n' + msg, {
      code: 'utf8'
    });
  }
};

exports.description = 'Shows all commands.';
