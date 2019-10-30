exports.run = (client, message, args) => {
  const data1 = args[0];
  const data2 = args[1];
  const chooseVal = Math.floor(Math.random() * 2 + 1);
  const ConfigService = require('../config.js');

  if (data1 == null && data2 == null) {
    return message.channel.send(`${ConfigService.config.prefix}choose [option1] [option2]`, { code: 'asciidoc' });
  }

  if (chooseVal == 2) {
    message.reply('I choose ' + data1);
  } else {
    message.reply('I choose ' + data2);
  }
};

exports.cmd = {
  enabled: true,
  category: 'Fun',
  level: 0,
  description: 'Choose between two items'
};
