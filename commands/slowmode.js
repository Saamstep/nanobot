exports.run = (client, message, args) => {
  let time = args[1] + ' seconds' || 'N/A';
  const embed = {
    description: 'This channel is now in slowmode',
    color: 14792508,
    timestamp: Date.now(),
    footer: {
      icon_url: client.avatarURL,
      text: client.username
    },
    author: {
      name: 'Slowmode Enabled'
    },
    fields: [
      {
        name: 'Speed',
        value: `${args[0]} seconds`,
        inline: true
      },
      {
        name: 'Time',
        value: time,
        inline: true
      }
    ]
  };

  if (client.isMod(message.author, message, client)) {
    if (!args[0] && !args[1]) {
      return message.channel.send(
        `\`\`\`${client.ConfigService.config.prefix}slowmode [speed] [time (optional)]\`\`\``
      );
    }
    if (args[0] && args[1]) {
      message.channel
        .setRateLimitPerUser(args[0], `Rate limit set by ${message.author.username}#${message.author.discriminator}`)
        .then(r => {
          setTimeout(function() {
            message.channel.setRateLimitPerUser(0, `Disabled automatically.`);
          }, args[1] * 1000);
        });
      message.channel.send({ embed });
    } else {
      message.channel.setRateLimitPerUser(
        args[0],
        `Rate limit set by ${message.author.username}#${message.author.discriminator}`
      );
      message.channel.send({ embed });
    }
  }
};
