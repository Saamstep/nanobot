exports.run = (client, member, message) => {
  var config = require('../config.json');
  let guild = member.guild;
  let NEWUSER = member.user
  let SERVERNAME = guild.name;
  let newchannel = guild.channels.find(`name`, `${config.joinCh}`);
  let newest = config.leaveMsg.replace('NEWUSER', NEWUSER).replace('SERVERNAME', SERVERNAME);
  newchannel.send(newest).catch(console.error);
};
