exports.run = (client, message, args) => {
  const error = require('../modules/errorMod.js');
  const ConfigService = require('../config.js');
  const member = message.mentions.members.first();
  let guild = message.guild;
  let addRole = message.guild.roles.find(
    'name',
    `${ConfigService.config.iamRole}`
  );
  let log = require('../modules/logMod.js');
  let isAdmin = require('../modules/isAdmin.js');
  message.delete();
  if (isAdmin(message.author, message)) {
    member.setNickname('');
    member.removeRole(addRole);
    log('User Reset', `${member} was reset`, 2942691, message, client);
  }
};
