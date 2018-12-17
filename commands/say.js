exports.run = (client, message, args) => {
  message.channel.startTyping();
  function sender() {
    message.delete(0);
    let msgSender = args.join(' ');
    message.channel.send(msgSender);

  }
  const ConfigService = require('../config.js');
  let isAdmin = require('../modules/isAdmin.js');
  if (isAdmin(message.author, message)) {
    if (args[0] == null) {

      return message.channel.send(
        `${ConfigService.config.prefix}say [message]`,
        { code: 'asciidoc' }
      );
    } else {
      return sender();
    }
  }
  message.channel.stopTyping(true);
};

exports.description = 'Allows admins to send a message as the bot.';
