exports.run = (client, message, args, cc) => {
  if (client.isAdmin(message.author, message, true, client)) {
    let target = client.channels.get(
      `${args[0]
        .replace(/</g, '')
        .replace(/>/g, '')
        .replace(/#/g, '')}`
    );
    let options = {
      maxAge: 0
    };
    target.createInvite(options, "Bot 'makeinv' command").then(inv => {
      message.channel.send(`> Your new invite has been created! https://discord.gg/${inv.code}`);
    });
  }
};

exports.cmd = {
  enabled: true,
  category: 'Admin',
  level: 2,
  description: 'Generate invite as the bot'
};
