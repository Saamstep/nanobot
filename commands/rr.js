exports.run = (client, message, args) => {
  let guild = message.guild;
  let user = message.guild.member(message.mentions.users.first());
  let string = `${args.join(' ').replace(user, '')}`;
  string = string.trim();
  let role = message.guild.roles.find('name', `${string}`);

  const errorMod = require('../modules/errorMod.js');

  const ConfigService = require('../config.js');

  let isAdmin = require('../modules/isAdmin.js');
  if (client.isAdmin(message.author, message, true, client)) {
    if (message.mentions.users.size === 0) {
      message.delete(0);
      return errorMod('Please mention a user', message)
        .then(
          setTimeout(function() {
            message.delete(0);
          }, 5000)
        )
        .catch(err => console.error);
    }

    message.delete(0);
    user.removeRole(role);
    message.channel.send(`**-** ${string} for user sucessfully!`);
  }
};
exports.cmd = {
  enabled: true,
  category: 'Admin',
  level: 2,
  description: 'Allows admins to remove role from a user.'
};
