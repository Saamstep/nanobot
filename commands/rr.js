exports.run = (client, message, args) => {

  let guild = message.guild;
  let role = message.guild.roles.find('name', `${args[1]}`);
  let user = message.guild.member(message.mentions.users.first());
  const errorMod = require('../modules/errorMod.js');


  const config = require('../config.json');

  let adminRole = message.member.roles.find('name', `${config.adminrolename}`);

  if (!message.member.roles.has(adminRole.id)) {
    message.delete(0)
    return errorMod('You do not have the right permissions', message);
  }

  if (message.mentions.users.size === 0) {
    message.delete(0)
    return errorMod('Please mention a user', message);
  }

  if (!user.roles.has(role.id)) {
    message.delete(0)
    return errorMod('That user does not have **' + role.name + "**!", message);
  }

  message.delete(0)
  user.removeRole(role.id);

};


exports.description = "Allows admins to remove role from a user."