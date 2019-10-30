// hi
exports.run = (client, message, args) => {
  const ConfigService = require('../config.js');
  const CommandList = require('../commandList.js');
  let list = CommandList.helpString();
  let list2 = '';
  if (CommandList.helpString().length >= 2000) {
    list = CommandList.helpString().substring(0, CommandList.helpString().length / 2);
    list2 = CommandList.helpString().substring(CommandList.helpString().length / 2, CommandList.helpString().length);
  }
  message.react('🖨');

  if (args[0] === 'here') {
    message.channel.send('Bot Commands:\n\n' + list, {
      code: 'utf8'
    });
    message.channel.send(list2, {
      code: 'utf8'
    });
  } else {
    message.author.send('Bot Commands:\n\n' + list, {
      code: 'utf8'
    });
    message.author.send(list2, {
      code: 'utf8'
    });
  }
};

exports.cmd = {
  enabled: true,
  category: 'Utility',
  level: 0,
  description: 'Get a list of all commands and bot help'
};
