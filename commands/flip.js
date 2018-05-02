exports.run = (client, message, args) => {
  let coinVal = Math.floor((Math.random() * 2) + 1);
  if (coinVal == 2) {
    message.reply(":arrows_counterclockwise: | Heads");
  } else {
    message.reply(":arrows_counterclockwise: | Tails");
  }
  exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['coin', 'coinflip'],
    permLevel: 0
  };

  exports.help = {
    name: 'flip',
    description: 'Flips a coin',
    usage: 'flip'
  }

};

exports.description = 'Flips a coin.'