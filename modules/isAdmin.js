module.exports = function isAdmin(user, message, msg, client) {
  // let admin = message.member.roles.find(a => a.name === `${ConfigService.config.admin}`);
  let admin = message.member.roles.find(
    a => a.name === `${client.ConfigService.config.roles.admin}`
  );

  let error = require("../modules/errorMod.js");
  try {
    if (message.member.roles.has(admin.id)) {
      return true;
    } else {
      return false;
    }
  } catch {
    if (message.author.id == client.ConfigService.config.ownerid) {
      return true;
    } else {
      let role = client.ConfigService.config.roles.admin;
      if (msg == true) {
        return error(
          `You are missing the \`${role}\` permission role.`,
          message
        );
      }
    }
  }
};
