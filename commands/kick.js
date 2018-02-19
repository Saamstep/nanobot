// exports.run = (client, message, args) => {
//   let modRole = message.guild.roles.find("name", "Mods");
//   if (!message.member.roles.has(modRole.id)) {
//     retursn message.reply(":no_entry_sign: | Error. You don't have the right permissions").catch(console.error);
//   }
//   if (message.mentions.users.size === 0) {
//     return message.reply(":no_entry_sign: | Please mention a user to kick").catch(console.error);
//   }
//   let kickMember = message.guild.member(message.mentions.users.first());
//   if (!kickMember) {
//     return message.reply(":no_entry_sign: | That user does not seem valid");
//   }
//   if (!message.guild.member(client.user).hasPermission("KICK_MEMBERS")) {
//     return message.reply(":no_entry_sign: | I don't have permission `KICK_MEMBER` to do this.").catch(console.error);
//   }
//   kickMember.kick().then(member => {
//     message.reply(`:wave: | **${member.user.username}** was succesfully kicked.`).catch(console.error);
//   }).catch(console.error);

//   exports.conf = {
//     enabled: false,
//     guildOnly: false,
//     permLevel: 2
//   };
    
//   exports.help = {
//     name: 'kick',
//     description: 'Kicks a user from the server.',
//     usage: 'kick [user]'
//   }
// };

