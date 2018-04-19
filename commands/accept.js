const config = require('../config.json');
const errorMod = require('../modules/errorMod.js');
exports.run = (client, message, args) => {
  let acceptMember = message.guild.member(message.mentions.users.first());
  let guild = message.guild.id;
  let memberRole = message.guild.roles.find('name', `${config.memberrole}`);

  if (!acceptMember) {
    errorMod('Please mention a user', message);
  }
  if (acceptMember) {
    acceptMember.addRole(memberRole);
    message.acceptMember.send(`${config.acceptMessage}`);
  }

  exports.description = 'Allows mod to accept members.';
};
