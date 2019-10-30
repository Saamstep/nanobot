exports.run = (client, message, args) => {
  if (client.isAdmin(message.author, message, true, client)) {
    switch (args[0]) {
      case 'edit':
        try {
          message.channel.fetchMessage(`${args[1]}`).then(m => {
            m.edit(
              args
                .join(' ')
                .replace(args[0], '')
                .replace(args[1], '')
            );
          });
        } catch (e) {
          return client.error('Channel not found, you must run in same channel as message!');
        }
        break;
      default:
        try {
          let announceChannel = client.channels.get(
            `${args[0]
              .replace(/</g, '')
              .replace(/>/g, '')
              .replace(/#/g, '')}`
          );
          announceChannel.send(args.join(' ').replace(args[0], ''));
        } catch (e) {
          return message.channel.send(
            `\`\`\`${client.ConfigService.config.prefix}announce [#channel] [message goes here]\nannounce edit [message id] [new message]\`\`\``
          );
        }
    }
    message.delete(0);
  }
};

exports.cmd = {
  enabled: true,
  category: 'Admin',
  level: 2,
  description: 'Allows admins to make announcements as the bot'
};
