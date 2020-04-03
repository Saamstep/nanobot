exports.run = (client, message, args) => {
  const disabled = ["─all─", "─info─", "─Update Feeds─"];

  if (disabled.indexOf(message.channel.parent.name) == -1) {
    client.notes.defer.then(() => {
      switch (args[0]) {
        case "add":
          //notes storage obj exists
          if (client.notes.has(message.channel.id)) {
            client.notes.push(message.channel.id, args.join(" ").substring(4, args.join().length));
            message.channel.send(`> Created note \`\`\`${args.join(" ").substring(4, args.join().length)}\`\`\``);
          } else {
            //create notes storage object
            client.notes.set(message.channel.id, [args.join(" ").substring(4, args.join().length)]);
            message.channel.send(`> Created note \`\`\`${args.join(" ").substring(4, args.join().length)}\`\`\``);
          }

          break;
        case "del":
          if (!args[1]) return client.error("Please specify a note ID to remove!", message);
          if (client.notes.has(message.channel.id)) {
            message.channel.send(`> Removing note \`${args[1]}\``);
            client.notes.remove(message.channel.id, args[1]);
          }
          break;
        case "list":
          if (client.notes.get(message.channel.id) == undefined || client.notes.get(message.channel.id).length == 0) return message.channel.send("> No notes here!");
          let chunk = "```";
          let i = 0;
          client.notes.get(message.channel.id).forEach(note => {
            chunk += `[${i++}] ${note}\n`;
          });
          message.channel.send(chunk + "```");
          break;
        case "deleteall":
          client.notes.delete(message.channel.id);
          break;
        default:
          message.channel.send(`\`\`\`${client.ConfigService.config.prefix}notes [add] [note text]\n notes [del] [index]\n notes list\`\`\``);
          break;
      }
    });
  } else {
    client.error("Notes are disabled here!", message);
  }
};
exports.cmd = {
  enabled: true,
  category: "Utility",
  level: 0,
  description: "Create and save notes specified and bounded per channel!"
};
