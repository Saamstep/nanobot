module.exports = function isAdmin(user, message) {
  const ConfigService = require('../config.js');
  let admin = message.member.roles.find(
    'name',
    `${ConfigService.config.adminrolename}`
  );
  let mod = message.member.roles.find(
    'name',
    `${ConfigService.config.modrolename}`
  );
  let error = require('../modules/errorMod.js');
  try {
    if (message.member.roles.has(admin.id)) {
      return true;
    } else {
      return false;
    }
  } catch {
    if (
      message.author.id == ConfigService.config.ownerid ||
      message.member.roles.has(mod.id)
    ) {
      return true;
    } else {
      let role = ConfigService.config.adminrolename;
      error(`You are missing the \`${role}\` permission role.`, message);
    }
  }
};
