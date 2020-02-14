exports.run = (client, message, args) => {
  const pkg = require("../package.json");
  async function cmd() {
    const embed = {
      color: 3447003,
      title: "Creator:",
      description: "This bot was made by Samstep",
      fields: [
        {
          name: "Social Links:",
          value: "[YouTube](http://www.bit.ly/subtosamstep) **|** [Twitch](http://www.twitch.tv/samstep) **|** [Twitter](http://www.twitter.com/saamstep) **|** [GitHub](http://gihub.com/saamstep)"
        },
        {
          name: "Thank You:",
          value: "[AnIdiotsGuide](http://anidiots.guide), [Nullpointer](http://twitch.tv/nullpointer128) & [SpyderHunter03](https://twitter.com/SpyderHunter03) for all the help!"
        },
        {
          name: "Bot Info:",
          value: `**${pkg.name} ${pkg.version}**\n${pkg.description}`
        },
        {
          name: "APIs:",
          value:
            "[Discord API](http://discordapp.com/developers/) **|** [Cat Fact](https://catfact.ninja) **|** [TheCatAPI](http://thecatapi.com) **|** [TheDogAPI](http://thedogapi.com) **|** [Coinbase](https://developers.coinbase.com/api/v2) **|** [OW API](https://owjs.ovh) | [Twitch API](https://dev.twitch.tv/) | [OverwatchLeague](https://overwatchleague.com) | [YouTube API](https://developers.google.com/youtube/v3) | [Toornament API](https://developer.toornament.com/v2/overview/get-started)"
        },
        {
          name: "Dependencies:",
          value: JSON.stringify(pkg.dependencies, null, 4)
        }
      ]
    };

    await message.channel.send({ embed });
  }
  cmd();
};

exports.cmd = {
  enabled: true,
  category: "Fun",
  level: 0,
  description: "Show information about the bot."
};
