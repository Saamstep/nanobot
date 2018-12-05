const ConfigService = require('../config.js');
const errorMod = require('../modules/errorMod.js');
exports.run = (client, message, args) => {
  let acceptMember = message.guild.member(message.mentions.users.first());
  let guild = message.guild.id;
  let memberRole = message.guild.roles.find('name', `Members`);
  let oldRole = message.guild.roles.find('name', `Application`);
  let newRole = message.guild.roles.find('name', `${ConfigService.config.introlename}`);
  let adminRole = message.member.roles.find('name', `${ConfigService.config.adminrolename}`);

  if (!message.member.roles.has(adminRole.id)) {
    return errorMod('You do not have the right permissions', message);
  }

  if (message.mentions.users.size === 0) {
    return errorMod('Please mention a user', message);
  }
  if (!acceptMember.roles.has(memberRole.id)) {
    // acceptMember.addRole(memberRole);
    message.guild.member(acceptMember).addRole(newRole);
    message.guild.member(acceptMember).removeRole(oldRole);
    acceptMember.send(`${ConfigService.config.interviewMessage}`);
    message.react('✅');
  } else {
    return errorMod('This user already is a member', message);
  }
};
exports.description = 'Allows admins to setup interviews.'

