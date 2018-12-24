// hi
exports.run = (client, message, args) => {
  const ConfigService = require('../config.js');
  const CommandList = require('../commandList.js');

  message.react('🖨');

  if (args[0] === 'here') {
    return message.channel.send('Bot Commands:\n\n' + CommandList.helpString(), {
      code: 'utf8'
    });
  } else {
    return message.author.send('Bot Commands:\n\n' + CommandList.helpString(), {
      code: 'utf8'
    });
  }
};

exports.description = 'Shows all commands.';
