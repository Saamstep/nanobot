exports.run = (client, message, args) => {
  if (client.isAdmin(message.author, message, true, client)) {
    switch (args[0]) {
      case 'setupmenu':
        let msg = '';
        message.delete(2000);
        client.ConfigService.config.roleReact.roles.forEach(role => {
          let i = client.ConfigService.config.roleReact.roles.indexOf(role);
          let emoji = client.emojis.get(client.ConfigService.config.roleReact.emojis[i]);
          msg += `${emoji} **-** \`${role}\`\n\n`;
        });
        message.channel.send(msg).then(m => {
          client.ConfigService.config.roleReact.roles.forEach(async role => {
            let i = client.ConfigService.config.roleReact.roles.indexOf(role);
            let emoji = client.emojis.get(client.ConfigService.config.roleReact.emojis[i]);
            await m.react(emoji);
          });
        });
        break;
      case 'updatemenu':
        message.channel.fetchMessage(client.ConfigService.config.roleReact.message).then(m => {
          let msg = '';
          message.delete(2000);
          client.ConfigService.config.roleReact.roles.forEach(role => {
            let i = client.ConfigService.config.roleReact.roles.indexOf(role);
            let emoji = client.emojis.get(client.ConfigService.config.roleReact.emojis[i]);
            msg += `${emoji} **-** \`${role}\`\n\n`;
          });
          m.edit(msg).then(r => {
            client.ConfigService.config.roleReact.roles.forEach(async role => {
              let i = client.ConfigService.config.roleReact.roles.indexOf(role);
              let emoji = client.emojis.get(client.ConfigService.config.roleReact.emojis[i]);
              await r.react(emoji);
            });
          });
        });
        break;
      case 'see':
        message.channel.send(
          `${client.ConfigService.config.roleReact.roles.join(
            ', '
          )}\n${client.ConfigService.config.roleReact.emojis.join(', ')}`
        );
        break;
      default:
        message.channel.send('args => setupmenu|updatemenu|see');
    }
  }
};
exports.cmd = {
  enabled: true,
  category: 'Admin',
  level: 2,
  description: 'Setup command for role react system'
};
