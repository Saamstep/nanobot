exports.run = (client, message, args) => {
  let guild = message.guild;
  let role = message.guild.roles.find('name', `${args.join(' ').slice(3)}`);
  let user = message.guild.member(message.mentions.users.first());
  const errorMod = require('../modules/errorMod.js');

  const ConfigService = require('../config.js');

  let isAdmin = require('../modules/isAdmin.js');
  if (isAdmin(message.author, message)) {
    if (message.mentions.users.size === 0) {
      message.delete(0);
      return errorMod('Please mention a user', message);
    }

    if (user.roles.has(role.id)) {
      message.delete(0);
      return errorMod('That user already has **' + role.name + '**!', message);
    }
    message.delete(0);
    user.addRole(role.id);
  }
};

exports.description = 'Allows admins to add role to a user.';
