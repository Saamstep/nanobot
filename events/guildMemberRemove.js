exports.run = (client, member, message) => {
  try {
    var ConfigService = require('../config.js');
    let guild = member.guild;
    let NEWUSER = member.user;
    let SERVERNAME = guild.name;
    let newchannel = guild.channels.find(`name`, `${ConfigService.config.channel.joinCh}`);
    let newest = ConfigService.config.leaveMsg.replace('USER', NEWUSER).replace('SERVER', SERVERNAME);
    newchannel.send(newest).catch(console.error);
  } catch (e) {
    console.error(e);
  }
};
