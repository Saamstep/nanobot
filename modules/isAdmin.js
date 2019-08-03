module.exports = function isAdmin(user, message, msg, client) {
  const ConfigService = require('../config.js');
  // let admin = message.member.roles.find(a => a.name === `${ConfigService.config.adminrolename}`);
  let admin = message.member.roles.find(a => a.name === `${client.settings.get(`${message.guild.id}`, 'roles.admin')}`);

  let error = require('../modules/errorMod.js');
  try {
    if (message.member.roles.has(admin.id)) {
      return true;
    } else {
      return false;
    }
  } catch {
    if (message.author.id == ConfigService.config.ownerid) {
      return true;
    } else {
      let role = ConfigService.config.roles.admin;
      if (msg == true) {
        return error(`You are missing the \`${role}\` permission role.`, message);
      }
    }
  }
};
