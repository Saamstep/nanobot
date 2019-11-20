exports.run = (client, member, message) => {
  var ConfigService = require('../config.js');
  try {
    let guild = member.guild;
    let newchannel = guild.channels.find(n => n.name == `${ConfigService.config.channel.joinCh}`);
    var replacer = ConfigService.config.joinMsg.replace('USER', member.user).replace('SERVER', guild.name);
    if (ConfigService.config.joinMsg === '') {
      return;
    } else {
      if (member.user.bot) {
        member.addRole(guild.roles.find(r => r.name == `${client.ConfigService.config.roles.bot}`));
      }
      newchannel.send(`${replacer}`).catch(console.error);
    }
  } catch (e) {
    console.error(e);
  }
};
