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

  if (game.length <= 10) {
    client.user
      .setPresence({ game: { name: game, type: 0 } })
      .catch(console.error);

    configChange(game);
    message.channel.send(
      ':gear: | Successfully changed the game to: ' + '`' + game + '`'
    );
  }
  if (game.length > 10) {
    return errorEvent(`\`${game}\` is too long`, message);
  }
  if (game === 'null') {
    return message.reply(':no_entry_sign: | Game cannot be empty.');
  }

  // exports.conf = {
  //   enabled: true,
  //   guildOnly: false,
  //   aliases: ['g'],
  //   permLevel: 5
  // };

  // exports.help = {
  //   name: 'game',
  //   description: 'Sets the playing message',
  //   usage: 'game [new]'
  // };
};
