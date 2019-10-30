exports.run = (client, message, args) => {
  message.channel.startTyping(1);
  function sender() {
    message.delete(0);
    let msgSender = args.join(' ');
    message.channel.send(msgSender);
    message.channel.stopTyping(true);
  }
  const ConfigService = require('../config.js');
  let isAdmin = require('../modules/isAdmin.js');
  if (client.isAdmin(message.author, message, true, client)) {
    if (args[0] == null) {
      return message.channel.send(`${ConfigService.config.prefix}say [message]`, { code: 'asciidoc' });
    } else {
      return sender();
    }
  }
};
exports.cmd = {
  enabled: true,
  category: 'Admin',
  level: 2,
  description: 'Allows admins to send a message as the bot.'
};
