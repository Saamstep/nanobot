exports.run = (client, message, args) => {
  const error = require('../modules/errorMod.js');
  const ConfigService = require('../config.js');
  let addRole = message.guild.roles.find('name', `${ConfigService.config.iamRole}`);
  let expression = client.ConfigService.config.nicknamer.expression
    .replace('USER', message.author.username)
    .replace('NICK', args[0]);
  if (message.channel.id !== ConfigService.config.nickChannelid) {
    return error('You cannot do that here!', message);
  } else {
    try {
      message.guild.fetchMember(message.author).then(member => {
        member.setNickname(expression);
      });
    } catch (err) {
      return;
    }
  }

  message.member.addRole(addRole).then(
    setTimeout(function() {
      message.delete(0);
    }, 1000)
  );
  // .catch(err => console.error);
};
exports.cmd = {
  enabled: true,
  category: 'Utility',
  level: 0,
  description: 'Set your real name when you join for the first time.'
};

