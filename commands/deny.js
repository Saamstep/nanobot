const config = require('../config.json');
const errorMod = require('../modules/errorMod.js');
exports.run = (client, message, args) => {
  let acceptMember = message.guild.member(message.mentions.users.first());
  let guild = message.guild.id;
  let memberRole = message.guild.roles.find('name', `${config.memberrole}`);
  let modRole = message.member.roles.find('name', `${config.modrolename}`);

  if (!message.member.roles.has(modRole.id)) {
    return errorMod('You do not have the right permissions', message);
  }

  if (message.mentions.users.size === 0) {
    return errorMod('Please mention a user', message);
  }
  if (!acceptMember.roles.has(memberRole.id)) {
    async function sender() {


      await acceptMember.send(`${config.denyMessage}`);
      await acceptMember.send({
        files: [`${config.denyImg}`]
      })
      await acceptMember.kick();
      await message.react('✅');

    }

    sender();

  } else {
    return errorMod('This user is a member', message);
  }
};
exports.description = 'Allows mods to deny members.'

