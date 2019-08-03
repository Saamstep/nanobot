module.exports = function isMod(user, message, client) {
  const ConfigService = require('../config.js');
  let mod = message.member.roles.find('name', `${client.settings.get(`${message.guild.id}`, 'roles.mod')}`);
  let admin = message.member.roles.find('name', `${client.settings.get(`${message.guild.id}`, 'roles.admin')}`);
  let error = require('../modules/errorMod.js');
  try {
    if (!message.member.roles.has(mod.id)) {
      return false;
    } else {
      return true;
    }
  } catch {
    if (message.author.id == ConfigService.config.ownerid || message.member.roles.has(admin.id)) {
      return true;
    } else {
      let role = ConfigService.config.modrolename;
      error(`You are missing the \`${role}\` permission role.`, message);
    }
  }
};
