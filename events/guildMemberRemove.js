exports.run = (client, member, message) => {
  try {
    var ConfigService = require('../config.js');
    let guild = member.guild;
    let newchannel = guild.channels.find(`name`, `${ConfigService.config.channel.joinCh}`);
    let newest = ConfigService.config.leaveMsg.replace('USER', member.user).replace('SERVER', guild.name);
    newchannel.send(newest).catch(console.error);
  } catch (e) {
    console.error(e);
  }
};
