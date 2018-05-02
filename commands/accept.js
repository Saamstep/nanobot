const config = require('../config.json');
const errorMod = require('../modules/errorMod.js');
exports.run = (client, message, args) => {
  let acceptMember = message.guild.member(message.mentions.users.first());
  let guild = message.guild.id;
  let memberRole = message.guild.roles.find('name', `${config.memberrole}`);
  let adminRole = message.member.roles.find('name', `${config.adminrolename}`);

  if (!message.member.roles.has(adminRole.id)) {
    return errorMod('You do not have the right permissions', message);
  }

  if (message.mentions.users.size === 0) {
    return errorMod('Please mention a user', message);
  }
  if (acceptMember.roles.not(memberRole.id)) {
    // acceptMember.addRole(memberRole);
    message.guild.member(acceptMember).addRole(memberRole);
    acceptMember.send(`${config.acceptMessage}`);
    message.react('✅');
  } else {
    return errorMod('This user already is a member', message);
  }
};
exports.description = 'Allows mods to accept members.'

