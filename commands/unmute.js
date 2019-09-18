exports.run = (client, message, args) => {
  if (client.isMod(message.author, message, client)) {
    message.delete(500);
    let target =
      message.mentions.members.first() ||
      message.guild.roles.find(r => r.name == `${client.ConfigService.config.iamRole}`);
    let reason = args.join(' ').replace(args[0], '') || 'No reason provided';
    if (args[0] == 'all') {
      message.channel
        .overwritePermissions(target, {
          SEND_MESSAGES: true
        })
        .catch(console.error);
      message.channel.send(`Unmuted ${target.name} role in **${message.channel.name}**.`);
      client.log(`@${target.name} role unmuted in #${message.channel.name}`, `${reason}`, 14611073, message, client);
    } else {
      message.channel
        .overwritePermissions(
          target,
          {
            SEND_MESSAGES: null
          },
          `@${target.user.username}#${target.user.discriminator} unmuted in #${message.channel.name} by ${message.author.username}`
        )
        .then(u =>
          u.permissionOverwrites
            .get(target.user.id)
            .delete(
              `@${target.user.username}#${target.user.discriminator} unmuted in #${message.channel.name} by ${message.author.username}`
            )
        );

      message.channel.send(`Removed Mute on ${target.user.username} in **${message.channel.name}**.`);
      client.log(
        `@${target.user.username}#${target.user.discriminator} unmuted in #${message.channel.name}`,
        `${reason}`,
        14611073,
        message,
        client
      );
    }
  }
};
