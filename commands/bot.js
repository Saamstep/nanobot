exports.run = (client, message, args) => {
  message.channel.sendEmbed({ color: 3447003,
    title: "Creator:",
    description: "This bot was made by Samstep",
    fields: [{
      name: "Social Links:",
      value: "[YouTube](http://www.bit.ly/subtosamstep) **|** [Twitch](http://www.twitch.tv/saamstep) **|** [Twitter](http://www.twitter.com/saamstep) **|** [Thanks to AnIdiotsGuide](http://anidiots.guide) for all the help!"

    }]
  });

  exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['bot', 'about'],
    permLevel: 0
  };

  exports.help = {
    name: 'bot',
    description: 'Bot creator displayed',
    usage: 'bot'
  };

};
