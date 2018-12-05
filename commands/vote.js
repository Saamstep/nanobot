exports.run = (client, message, args) => {
  let otherMessage = message.guild;
  const ConfigService = require('../config.js');
  let adminRole = message.guild.roles.find('name', `${ConfigService.config.adminrolename}`);

  function react(emoji) {
    message.react('👍');
    message.react('👎');
  }

  if (!message.member.roles.has(adminRole.id)) {
    return message
      .reply(":no_entry_sign: | Error. You don't have the right permissions")
      .catch(console.error);
  }

  message.delete(0);
  let msgSender = args.join(' ');
  message.channel.send(msgSender).then(async function (sentMessage) {
    await sentMessage.react('👍');
    await sentMessage.react('👎');
  }).catch(err => console.error)

};

exports.description = 'Allows admins to send a message with reactions to take a poll.'
