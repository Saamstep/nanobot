exports.run = (client, message, args, cc) => {
  const syntax = `\`\`\`${client.ConfigService.config.prefix}verify [@user] [firstName] [year]\`\`\``;
  let target;
  let year;
  let firstName;
  let currentYears = ["2020", "2021", "2022", "2023"];
  try {
    target = message.guild.member(message.mentions.users.first());
  } catch (e) {
    return client.error("I could not find that user.\n" + syntax, message);
  }

  try {
    if (currentYears.indexOf(args[2]) == -1 && args[2] != null) {
      return client.error("This is an invalid year\n" + syntax, message);
    }
    year = message.guild.roles.find(r => r.name == args[2]);
  } catch (e) {
    return client.error(`Could not find year, \`${args[2]}\`\n` + syntax, message);
  }

  try {
    firstName = args[1];
  } catch (e) {
    return client.error("Please specify their first name!\n" + syntax, message);
  }

  let joinRole = message.guild.roles.find(r => r.name == client.ConfigService.config.roles.iamRole);
  if (target.roles.has(joinRole.id) && year == null) {
    let oldNick = target.nickname.substring(target.nickname.indexOf("(") + 1, target.nickname.indexOf(")"));
    if (oldNick == firstName) return client.error("These names are the same silly!", message);
    target.setNickname(`${target.user.username} (${firstName})`);
    client.log(`First name updated on ${target.user.username}#${target.user.discriminator}`, `Old Name: ${oldNick}\nNew Name: ${firstName}`, 3298328, message, client);
    return message.react("✅");
  }
  if (target.roles.has(joinRole.id) || target.roles.has(year.id)) {
    return client.error("This user is already verified!", message);
  } else {
    target.addRole(joinRole);
    target.addRole(year);
    target.setNickname(`${target.user.username} (${firstName})`);
    target.send("You have been verified successfully. Enjoy chatting in the **VCHS Esports** Discord server!\nRemember to read our Code of Conduct as all Discord members must abide by it: https://vchsesports.net/codeofconduct");
    client.log(`${target.user.username}#${target.user.discriminator} was verified`, `**This user was verified manually!**\nName: ${firstName}\nYear: ${year}`, 3298328, message, client);
    return message.react("✅");
  }
};

exports.cmd = {
  enabled: true,
  category: "VCHS Esports",
  level: 1,
  description: "Allows mods to manually verify a user"
};
