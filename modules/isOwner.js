module.exports = function isOwner(message) {
  const ConfigService = require('../config.js');

  let error = require('../modules/errorMod.js');
  if (message.author.id == ConfigService.config.ownerid) {
    return true;
  } else {
    return error(`You are not the owner!`, message);
  }
};
