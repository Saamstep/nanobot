const ConfigService = require('../config.js');
const errorMod = require('../modules/errorMod.js');
exports.run = (client, message, args) => {
  const acceptMember = message.guild.member(message.mentions.users.first());
  const memberRole = message.guild.roles.find('name', `${ConfigService.config.memberrole}`);

  const intRole = message.guild.roles.find('name', `${ConfigService.config.introlename}`);
  const appRole = message.guild.roles.find('name', 'Application');

  const isAdmin = require('../modules/isAdmin.js');

  if (client.client.isAdmin(message.author, message, true, client)) {
    if (message.mentions.users.size === 0) {
      return errorMod('Please mention a user', message);
    }
    if (!acceptMember.roles.has(memberRole.id)) {
      message.guild.member(acceptMember).addRole(memberRole);
      message.guild.member(acceptMember).removeRole(appRole);
      message.guild.member(acceptMember).removeRole(intRole);

      acceptMember.send(`${ConfigService.config.acceptMessage}`);
      message.react('✅');
    } else {
      return errorMod('This user already is a member', message);
    }
  }
};
exports.description = 'Allows mods to accept members.';
