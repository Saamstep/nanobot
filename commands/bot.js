exports.run = (client, message, args) => {

  async function cmd() {
    await message.channel.startTyping();

    await message.channel.sendEmbed({
      color: 3447003,
      title: "Creator:",
      description: "This bot was made by Samstep",
      fields: [{
        name: "Social Links:",
        value: "[YouTube](http://www.bit.ly/subtosamstep) **|** [Twitch](http://www.twitch.tv/saamstep) **|** [Twitter](http://www.twitter.com/saamstep) **|** [Thanks to AnIdiotsGuide](http://anidiots.guide) for all the help!"

      }]
    });

    await message.channel.stopTyping();
  }
  cmd()
};

exports.description = 'Shows info about the bot.'
