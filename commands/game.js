exports.run = (client, message, args) => {
  var config = require('../config.json');
  let game = args.join(' ');
  var errorEvent = require('../modules/errorMod.js');

  function configChange(game) {
    const fs = require('fs');
    game = config.defaultGame;
    fs.writeFile(
      '../config.json',
      JSON.stringify(config, null, 2),
      err => console.error
    );

  }

  if (game.length > 10) {
    return errorEvent(`\`${game}\` is too long`, message);
  }
  if (game == null) {
    return errorEvent('Game cannot be empty.', message);
  }

  if (game.length <= 10) {
    client.user.setPresence({ game: { name: game, type: 0 } }).catch(console.error);

    configChange(game);
    message.channel.send(
      ':gear: | Successfully changed the game to: ' + '`' + game + '`'
    );
  }


};

exports.description = 'Allows admins to change the game.'
