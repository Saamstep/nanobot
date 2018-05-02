const config = require('../config.json');

exports.run = (client, message, args) => {
  let member = message.mentions.users.first();
  //  console.log(member);

  // member.addRole(memberRole);
  member.send(config.acceptMessage).catch(console.error);
  message.channel.send('Accepted ' + member);

  const logEvent = require('../modules/logMod.js');

  logEvent(
    'Member Added',
    `${member} has been promoted to Member.`,
    13632027,
    message
  );

  // let modRole = message.guild.roles.find("name", `${modrolename}`);

  // if (!message.member.roles.has(modRole.id)) {
  //   return message.reply(":no_entry_sign: | Error. You don't have the right permissions").catch(console.error);
  // }
  // if (message.mentions.users.size === 0) {
  //   return message.reply(":no_entry_sign: | Please mention a user to promote").catch(console.error);
  // }
  // let promote = message.guild.member(message.mentions.users.first()).catch(console.error);
  // if (!promote) {
  //   return message.reply(":no_entry_sign: | That user does not seem valid").catch(console.error);
  // }
  // exports.conf = {
  //   enabled: true,
  //   guildOnly: false,
  //   aliases: ['add'],
  //   permLevel: 4
  // };

  // exports.help = {
  //   name: 'member',
  //   description: 'Promotes a user to member and sends them all server info.',
  //   usage: 'member [user]'
  // }
};

exports.description = 'Allows mods promote users to Member without sending the accept message.'
