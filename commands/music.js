exports.run = (client, message, args) => {
  message.channel.send(":warning: | All commands that are prefixed `!+` will not be functional tempoarily." /*:notes: | Follow these commands:\n**Commands:**\n!play <link> (if no link is provided the bot will search with Google)\n!skip [# of songs] (default value is 1)\n!queue\n!pause\n!resume\n**Location:** The bot is hosted in West Coast USA but connection should be clear no matter where you are.*/).catch(console.error);
};
