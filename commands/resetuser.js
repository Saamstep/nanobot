exports.run = (client, message, args, veriEnmap) => {
  const error = require('../modules/errorMod.js');
  const ConfigService = require('../config.js');
  const member = message.mentions.members.first();
  let addRole = message.guild.roles.find(r => r.name === `${client.ConfigService.config.roles.iamRole}`);
  let log = require('../modules/logMod.js');
  let isAdmin = require('../modules/isAdmin.js');
  message.delete();
  if (client.isAdmin(message.author, message, true, client)) {
    member.setNickname('');
    member.removeRole(addRole);
    veriEnmap.defer.then(() => {
      veriEnmap.get(member.id, 'roles').forEach(function(role) {
        let remove = message.guild.roles.find(r => r.name === `${role}`);
        member.removeRole(remove);
      });

      veriEnmap.delete(`${member.id}`);
    });
    log('User Reset', `${member} was reset`, 2942691, message, client);
  }
};
exports.cmd = {
  enabled: true,
  category: 'Admin',
  level: 2,
  description: 'Verification System: reset a user completely.'
};
