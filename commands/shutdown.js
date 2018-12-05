exports.run = (client, message, args) => {
  const ConfigService = require('../config.js');
  if (message.author.id !== `${ConfigService.config.ownerid}`) {
    const errorMod = require('../modules/errorMod.js');
    return errorMod(':no_entry_sign: | You are not the bot owner!');
  } else {
    client.destroy(err => {
      console.log('====================');
      console.log('Command: [!@shutdown] run by ' + message.author.username);
      console.log('====================');
      console.log(err);
    });
  }
};

exports.description = 'Allows owner to force shutdown the bot.';
