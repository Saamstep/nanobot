exports.run = (client, message, args) => {
  // console.log(client.settings);
  switch (args[0]) {
    case 'show':
      if (`${client.settings.get(message.channel.guild.id, `${args[1]}`)}` == '') return message.channel.send('::');
      message.channel.send(`${client.settings.get(message.guild.id, `${args[1]}`)}`);
      break;
    case 'edit':
      let value = args.join(' ').replace(args[0], '');
      value = value.replace(args[1], '');
      value = value.trim();
      if (!args[1]) return client.error('Provide a field to edit!', message);
      client.settings.set(`${message.guild.id}`, `${value}`, `${args[1]}`);
      client.log(`Config Updated: \`${args[1]}\``, `Updated to -> \`${value}\``, message, client);
      break;
    default:
      let set = client.settings.get(message.channel.guild.id);
      let msg = '';
      for (var prop in set) {
        if (typeof set[prop] === 'object') {
          for (var type in set[prop]) {
            if (msg.includes(prop)) {
              msg += `${type} = ${JSON.stringify(client.settings.get(`${message.guild.id}`, `${prop}.${type}`))}\n`;
            } else {
              msg += `\n[${prop}]\n${type} - ${client.settings.get(
                `${message.channel.guild.id}`,
                `${prop}.${type}`
              )}\n`;
            }
          }
        } else {
          msg += `${prop} = ${JSON.stringify(set[prop])}\n`;
        }
      }
      message.channel.send(`\`\`\`asciidoc\n${msg}\`\`\``);
  }
};
