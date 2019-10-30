exports.run = (client, message, args) => {
  let otherMessage = message.guild;
  const ConfigService = require('../config.js');
  let isMod = require('../modules/isMod.js');
  if (isMod(message.author, message, client)) {
    function react(emoji) {
      message.react('👍');
      message.react('👎');
    }

    message.delete(0);
    let msgSender = args.join(' ');
    message.channel
      .send(msgSender)
      .then(async function(sentMessage) {
        await sentMessage.react('👍');
        await sentMessage.react('👎');
      })
      .catch(err => console.error);
  }
};

exports.cmd = {
  enabled: true,
  category: 'Utility',
  level: 1,
  description: 'Create a yes/no style vote poll'
};
