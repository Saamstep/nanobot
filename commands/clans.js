exports.run = (client, message, args, conn) => {
  let guild = message.guild;
  switch (args[0]) {
    case 'add':
      guild
        .createRole({
          name: args[1]
        })
        .then(role => message.channel.send(`Added clan role **${role.name}**`));
      
      break;
    default:
      message.channel.send('```?clans add [name]\n?clans modify [color/name]');
  }
};
