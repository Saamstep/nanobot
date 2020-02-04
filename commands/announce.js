exports.run = (client, message, args) => {
  if (client.isAdmin(message.author, message, true, client)) {
    switch (args[0]) {
      case "edit":
        try {
          message.channel.fetchMessage(`${args[1]}`).then(m => {
            m.edit({
              embed: {
                description: args
                  .join(" ")
                  .replace(args[0], "")
                  .replace(args[1], "")
              }
            });
          });
        } catch (e) {
          return client.error("Channel not found, you must run in same channel as message!", message);
        }
        break;
      case "append":
        try {
          message.channel.fetchMessage(`${args[1]}`).then(m => {
            m.edit({
              embed: {
                description:
                  m.embeds[0].description +
                  " " +
                  args
                    .join(" ")
                    .replace(args[0], "")
                    .replace(args[1], "")
              }
            });
          });
        } catch (e) {
          return client.error("Channel not found, you must run in same channel as message!", message);
        }
        break;
      case "embed":
        try {
          let announceChannel = client.channels.get(
            `${args[1]
              .replace(/</g, "")
              .replace(/>/g, "")
              .replace(/#/g, "")}`
          );
          let json = args.join(" ").substring(args[0].length + args[1].length + 2, args.join().length);
          announceChannel.send({
            embed: JSON.parse(json)
          });
        } catch (e) {
          return client.error(e, message);
        }
        break;
      default:
        try {
          let announceChannel = client.channels.get(
            `${args[0]
              .replace(/</g, "")
              .replace(/>/g, "")
              .replace(/#/g, "")}`
          );
          announceChannel.send({ embed: { description: args.join(" ").replace(args[0], "") } });
        } catch (e) {
          return message.channel.send(`\`\`\`${client.ConfigService.config.prefix}announce [#channel] [message goes here]\nannounce edit [message id] [new message]\nannounce append [message id] [text to append\nannounce embed [embed JSON]\`\`\``);
        }
    }
    message.delete(0);
  }
};

exports.cmd = {
  enabled: true,
  category: "Admin",
  level: 2,
  description: "Allows admins to make announcements as the bot"
};
