module.exports = function isOwner(message, msg, client) {
  let error = require('../modules/errorMod.js');
  if (message.author.id == `${client.settings.get(`${message.guild.id}`, 'ownerid')}`) {
    return true;
  } else {
    if (msg == true) {
      return error(`You are not the owner!`, message);
    }
  }
};
