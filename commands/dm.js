exports.run = (client, message, args) => {
  message.channel.startTyping(1);
  console.log(message.guild.members);
  function sender() {
    message.delete(0);
    let member = message.guild.member(message.mentions.users.first());
    let msgSender = args.join(' ').replace(`${member}`, '\n');
    member.send(msgSender);
    message.channel.stopTyping(true);
  }

  const ConfigService = require('../config.js');
  if (client.isAdmin(message.author, message, true, client)) {
    if (args[0] == null) {
      return message.channel.send(`${ConfigService.config.prefix}dm [@user] [message]`, { code: 'asciidoc' });
    } else {
      try {
        sender();
        message.channel.stopTyping(true);
      } catch (e) {
        error('There was an error sending that DM', message);
      }
    }
  }
};
exports.cmd = {
  enabled: true,
  category: 'Admin',
  level: 2,
  description: 'Send a DM to a user'
};
