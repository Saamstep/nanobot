exports.run = (client, member, message) => {
  var config = require("../config.json");
  let guild = member.guild;
  let NEWUSER = member.user
  let SERVERNAME = guild.name;
  let newchannel = guild.channels.find(`name`, `${config.joinCh}`);
  var replacer = config.joinMsg.replace('NEWUSER', NEWUSER).replace('SERVERNAME', SERVERNAME);
  newchannel.send(`${replacer}`).catch(console.error);

};
