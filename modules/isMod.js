module.exports = function isMod(user, message, client, msg) {
  const ConfigService = require("../config.js");
  let mod = message.member.roles.find(
    n => n.name == `${client.ConfigService.config.roles.mod}`
  );
  let admin = message.member.roles.find(
    n => n.name == `${client.ConfigService.config.roles.admin}`
  );
  let error = require("../modules/errorMod.js");
  try {
    if (message.member.roles.has(mod.id)) {
      return true;
    } else if (
      message.member.roles.has(admin.id) ||
      message.author.id == ConfigService.config.ownerid
    ) {
      return true;
    } else {
      return false;
    }
  } catch {
    let role = client.ConfigService.config.roles.mod;
    if (msg) error(`You are missing the \`${role}\` permission role.`, message);
  }
};
