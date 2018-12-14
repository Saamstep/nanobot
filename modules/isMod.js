module.exports = function isMod(user, message) {
  const ConfigService = require('../config.js');
  let mod = message.member.roles.find(
    'name',
    `${ConfigService.config.modrolename}`
  );
  let error = require('../modules/errorMod.js');
  try {
    if (!message.member.roles.has(mod.id)) {
      return false;
    } else {
      return true;
    }
  } catch {
    if (message.author.id == ConfigService.config.ownerid) {
      return true;
    } else {
      let role = ConfigService.config.modrolename;
      error(`You are missing the \`${role}\` permission role.`, message);
    }
  }
};
