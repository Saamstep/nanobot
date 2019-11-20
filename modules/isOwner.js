module.exports = function isOwner(message, msg, client) {
  let error = require("../modules/errorMod.js");
  if (message.author.id == `${client.ConfigService.config.ownerid}`) {
    return true;
  } else {
    if (msg == true) {
      return error(`You are not the owner!`, message);
    }
  }
};
