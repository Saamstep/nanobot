exports.run = (client, message, args) => {
  if (client.isOwner()) {
    client.ConfigService.setConfigProperty(`${args[0]}`, args[1]);
    client.log('Config Property Updated', `\`${args[0]}\` updated to \`${args[1]}\``, 16776960, message, client);
    message.channel.send(`Updated config property \`${args[0]}\` to \`${args[1]}\``);
  }
};
exports.cmd = {
  enabled: true,
  category: 'Admin',
  level: 3,
  description: 'Change config properties'
};
