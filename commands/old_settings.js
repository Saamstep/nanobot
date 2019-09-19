exports.run = (client, message, args) => {
  if (client.isAdmin(message.author, message, true, client)) {
    switch (args[0]) {
      case 'show':
        if (`${client.settings.get(message.channel.guild.id, `${args[1]}`)}` == '') return message.channel.send('::');
        message.channel.send(`${client.settings.get(message.guild.id, `${args[1]}`)}`);
        break;
      case 'edit':
        //determines the new value based on args and allows for whitespaces
        let value = args.join(' ').replace(args[0], '');
        value = value.replace(args[1], '');
        value = value.trim();
        //if no value to change is detected errors
        if (!args[1]) return client.error('Provide a field to edit!', message);
        //checks and makes sure config field exists
        if (!client.settings.has(message.guild.id, `${args[1]}`))
          return client.error('That setting was not found.', message);
        //if type array then push/remove value instead of set
        if (Array.isArray(client.settings.get(`${message.guild.id}`, `${args[1]}`))) {
          if (args[3] == '-') {
            //uses minus sign to detect if user wants to remove value from array
            client.settings.remove(`${message.guild.id}`, `${args[2]}`, `${args[1]}`);
            message.channel.send(`Removed \`${args[2]}\` in \`${args[1]}\``);
            client.log(`Config Updated: \`${args[1]}\``, `Removed \`${args[2]}\``, 16776960, message, client);
          } else {
            //if no minus sign found then just add it
            client.settings.push(`${message.guild.id}`, `${args[2]}`, `${args[1]}`);
            message.channel.send(`Added \`${args[2]}}\` to \`${args[1]}\``);
            client.log(`Config Updated: \`${args[1]}\``, `Added \`${args[2]}\``, 16776960, message, client);
          }
        } else {
          //if not array type then just set
          client.settings.set(`${message.guild.id}`, `${value}`, `${args[1]}`);
          message.channel.send(`Updated \`${args[1]}\` to \`${value}\``);
          client.log(`Config Updated: \`${args[1]}\``, `Updated to -> \`${value}\``, 16776960, message, client);
        }
        break;
      default:
        let set = client.settings.get(message.channel.guild.id);
        let msg = '';
        for (var prop in set) {
          if (typeof set[prop] === 'object') {
            for (var type in set[prop]) {
              if (msg.includes(prop)) {
                msg += `${type} :: ${JSON.stringify(client.settings.get(`${message.guild.id}`, `${prop}.${type}`))}\n`;
              } else {
                msg += `\n= ${prop} =\n${type} :: ${client.settings.get(
                  `${message.channel.guild.id}`,
                  `${prop}.${type}`
                )}\n`;
              }
            }
          } else {
            msg += `${prop} :: ${JSON.stringify(set[prop])}\n`;
          }
        }
        const helpMsg = `= Help =\n- Variables\nUSER :: Username of user referencing\nSERVER :: The server's name.\nNot avaliable for all settings.\n-----------------`;
        message.channel.send(`\`\`\`asciidoc\n${helpMsg}\n${msg}\`\`\``);
    }
  }
};
exports.description = '(DEPRECATED) Allows admins to change bot configuration';
