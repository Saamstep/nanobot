exports.run = (client, message, args) => {

  const error = require('../modules/errorMod.js');
  const ConfigService = require('../config.js');
  let guild = message.guild
  let addRole = message.guild.roles.find('name', `${ConfigService.config.iamRole}`);

  if (message.channel.id !== ConfigService.config.nickChannelid) {
    return error('You cannot do that here!', message);
  } else {
    try {
      let name = args[0];
      message.guild.fetchMember(message.author)
        .then(member => {
          member.setNickname(name);
        })
    } catch (err) {
      return;
    };

  }


  message.member.addRole(addRole).then(setTimeout(function () { message.delete(0) }, 3000)).catch(err => console.error);

};

exports.description = "Set your real name when you join for the first time."
