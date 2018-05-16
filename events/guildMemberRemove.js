exports.run = (client, member, message) => {
  var config = require('../config.json');
  let guild = member.guild;
  let joinUser = member.user;
  let guildServer = guild.name;
  let newchannel = guild.channels.find(`name`, `${config.joinCh}`);
  newchannel.send(joinUser + ' left ' + '**' + guildServer + '** .').catch(console.error);
};
