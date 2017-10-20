exports.run = (client, member) => {
  let guild = member.guild;
  let guildServer = guild.name;
  message.guild.name("Welcome {$member.user} to " + guildServer).catch(console.error);
};
