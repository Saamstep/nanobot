exports.run = (client, message, args) => {
  let otherMessage = message.guild;
  const config = require('../config.json');
  let adminRole = message.guild.roles.find('name', `${config.adminrolename}`);

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

  // .then(async message => {
  //   await message.react('👍');
  //   await message.react('👎');
  // });
};

exports.description = 'Allows admins to send a message with reactions to take a poll.'
