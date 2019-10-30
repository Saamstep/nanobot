exports.run = (client, message, args, veriEnmap, cc) => {
  if (client.isMod(message.author, message, client)) {
    message.delete(500);
    let category = message.guild.channels.find(ch => ch.name == 'All');
    let role = message.guild.roles.find(r => r.name == `${client.ConfigService.config.roles.iamRole}`);
    let mode = '';
    if (category.permissionOverwrites.get(role.id).deny == 2048) {
      mode = 'DISABLED';
      category
        .overwritePermissions(role, {
          SEND_MESSAGES: true
        })
        .catch(console.error);
    } else {
      mode = 'ENABLED';
      category
        .overwritePermissions(role, {
          SEND_MESSAGES: false
        })
        .catch(console.error);
    }

    message.channel.send('Lockdown was **' + mode + '** by ' + message.author.username);
    client.log(`Lockdown`, `**${mode}**`, 14611073, message, client);
  }
};

exports.cmd = {
  enabled: true,
  category: 'Moderation',
  level: 2,
  description: 'Set your real name when you join for the first time.'
};
