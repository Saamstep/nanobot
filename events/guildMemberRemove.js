exports.run = (client, member, message) => {
  var ConfigService = require('../config.js');
  let guild = member.guild;
  let NEWUSER = member.user
  let SERVERNAME = guild.name;
  let newchannel = guild.channels.find(`name`, `${ConfigService.config.joinCh}`);
  let newest = ConfigService.config.leaveMsg.replace('NEWUSER', NEWUSER).replace('SERVERNAME', SERVERNAME);
  newchannel.send(newest).catch(console.error);
};
