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
exports.cmd = {
  enabled: true,
  category: 'Moderation',
  level: 1,
  description: 'Allows moderators to server unmute all/specific user(s) in current channel'
};
