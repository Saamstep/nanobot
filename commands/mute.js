exports.run = (client, message, args) => {
  if (client.isMod(message.author, message, client)) {
    message.delete(500);
    let target =
      message.mentions.members.first() ||
      message.guild.roles.find(r => r.name == `${client.ConfigService.config.roles.iamRole}`);
    let reason = args.join(' ').replace(args[0], '') || 'No reason provided';
    if (args[0] == 'all') {
      message.channel
        .overwritePermissions(target, {
          SEND_MESSAGES: false
        })
        .catch(console.error);
      message.channel.send(`Muted ${target.name} role in **${message.channel.name}**.`);
      client.log(`@${target.name} role muted in #${message.channel.name}`, `${reason}`, 14611073, message, client);
    } else {
      message.channel
        .overwritePermissions(
          target,
          {
            SEND_MESSAGES: false
          },
          `@${target.user.username}#${target.user.discriminator} muted in #${message.channel.name} by ${message.author.username}`
        )
        .catch(console.error);
      message.channel.send(`Muted ${target.user.username} in **${message.channel.name}**.`);
      client.log(
        `@${target.user.username}#${target.user.discriminator} muted in #${message.channel.name}`,
        `${reason}`,
        14611073,
        message,
        client
      );
    }
  }
};
