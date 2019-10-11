exports.run = (client, message, args) => {
  let msg = '';
  message.delete(2000);
  client.ConfigService.config.roleReact.roles.forEach(role => {
    let i = client.ConfigService.config.roleReact.roles.indexOf(role);
    let emoji = client.emojis.get(client.ConfigService.config.roleReact.emojis[i]);
    msg += `${emoji} :: **${role}**\n`;
  });
  message.channel.send(msg).then(m => {
    client.ConfigService.config.roleReact.roles.forEach(role => {
      let i = client.ConfigService.config.roleReact.roles.indexOf(role);
      let emoji = client.emojis.get(client.ConfigService.config.roleReact.emojis[i]);
      m.react(emoji);
    });
  });
};
