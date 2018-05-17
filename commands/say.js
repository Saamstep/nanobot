exports.run = (client, message, args) => {
  message.channel.startTyping();
  function sender() {
    message.delete(0);
    let msgSender = args.join(' ');
    message.channel.send(msgSender);
    message.channel.stopTyping(true);
  }
  const config = require('../config.json');
  let modRole = message.guild.roles.find("name", `${config.adminrolename}`);
  if (!message.member.roles.has(modRole.id)) {
    message.channel.stopTyping(true);
    return message.channel.send(":no_entry_sign: | Error. You don't have the right permissions").catch(console.error);
  }
  if (args[0] == null) {
    message.channel.stopTyping(true);
    return message.channel.send(`${config.prefix}say [message]`, { code: 'asciidoc' })

  } else {
    return sender();
  }


};

exports.description = 'Allows admins to send a message as the bot.'