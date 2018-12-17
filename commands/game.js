exports.run = (client, message, args) => {
  const ConfigService = require('../config.js');
  let game = args.join(' ');
  var errorEvent = require('../modules/errorMod.js');

  let isAdmin = require('../modules/isAdmin.js');
  if (isAdmin(message.author, message)) {
    if (game.length > 10) {
      return errorEvent(`\`${game}\` is too long`, message);
    }
    if (game == null) {
      return errorEvent('Game cannot be empty.', message);
    }

    if (game.length <= 10) {
      client.user
        .setPresence({ game: { name: game, type: 0 } })
        .catch(console.error);
      message.channel.send(
        ':gear: | Successfully changed the game to: ' + '`' + game + '`'
      );
    }
  }
};

exports.description = 'Allows admins to change the game.';
