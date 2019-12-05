exports.run = (client, message, args, veriEnmap, cc) => {
  if (client.isMod(message.author, message, client)) {
    switch (args[0]) {
      case "clearALL_dangerous_be_careful":
        veriEnmap.defer.then(() => {
          veriEnmap.deleteAll();
          message.channel.send("Cleared verification enmap");
        });
        client.log("All Data Deleted", `Yea... its all gone :|`, 2942691, message, client);
        break;
      case "addrole":
        let member = message.mentions.members.first();
        let roleUser = message.guild.members.get(member.id);
        if (!args[1]) return;
        let roleName = args[2];
        if (args[3]) roleName += args[3];
        roleUser.addRole(message.guild.roles.find(r => r.name === `${roleName}`));
        veriEnmap.push(`${member.id}`, `${roleName}`, "roles");
        message.channel.send(`Updated ${member.user.username}.`);
        client.log("Role Added to User", `${member} now has role \`${args[2]}\``, 2942691, message, client);
        break;
      case "removerole":
        let m2 = message.mentions.members.first();
        let r2 = message.guild.members.get(m2.id);
        if (!args[1]) return;
        let rName = args[2];
        if (args[3]) rName += args[3];
        r2.removeRole(message.guild.roles.find(r => r.name === `${rName}`));
        veriEnmap.remove(`${m2.id}`, `${rName}`, "roles");
        message.channel.send(`Updated ${m2.user.username}'s roles.`);
        client.log("Role Removed from User", `${m2} now does not have role \`${args[2]}\``, 2942691, message, client);
        break;
      case "updatename":
        let m = message.mentions.members.first();
        let r = message.guild.members.get(m.id);
        veriEnmap.set(`${m.id}`, `${args[2]}`, "name");
        r.setNickname(`${m.user.username} (${veriEnmap.get(m.id, "name")})`);
        message.channel.send(`Updated ${m.user.username}'s name to ${args[2]}.`);
        client.log("User's Name Updated", `${m} now is named ${args[2]} ${args[3]}`, 2942691, message, client);
        break;
      case "seedata":
        veriEnmap.defer.then(() => {
          if (!args[0]) {
            const embed = {
              color: 16239504,
              author: {
                name: `${message.author.username}'s Data`,
                avatar_url: `${message.author.avatarURL}`
              },
              fields: [
                {
                  name: "Name",
                  value: `${veriEnmap.get(`${message.author.id}`, "name")}`
                },
                {
                  name: "Discord",
                  value: `${message.author.username}#${message.author.discriminator}`
                },
                {
                  name: "Class",
                  value: `${veriEnmap.get(`${message.author.id}`, "class")}`
                },
                {
                  name: "Email",
                  value: `${veriEnmap.get(`${message.author.id}`, "email")}`
                },
                {
                  name: "Interested Games",
                  value: `${veriEnmap.get(`${message.author.id}`, "roles").join("\n")}`
                }
              ]
            };
            message.author.send({ embed });
          } else {
            var member = message.mentions.users.first();
            const embed = {
              color: 16239504,
              author: {
                name: `${member.username}'s Data`,
                avatar_url: `${member.avatarURL}`
              },
              fields: [
                {
                  name: "Name",
                  value: `${veriEnmap.get(`${member.id}`, "name")}`
                },
                {
                  name: "Discord",
                  value: `<@${member.id}>`
                },
                {
                  name: "Class",
                  value: `${veriEnmap.get(`${member.id}`, "class")}`
                },
                {
                  name: "Email",
                  value: `${veriEnmap.get(`${member.id}`, "email")}`
                },
                {
                  name: "Interested Games",
                  value: `${veriEnmap.get(`${member.id}`, "roles").join("\n")}`
                }
              ]
            };
            if (client.isMod(message.author, message, client)) return message.author.send({ embed });
          }
        });
        break;
      default:
        message.channel.send(`\`\`\`${client.ConfigService.config.prefix}verify [clearALL_dangerous_be_careful/addrole/removerole/updatename/seedata] [user] [new]\`\`\``);
    }
  }
};

exports.cmd = {
  enabled: true,
  category: "VCHS Esports",
  level: 1,
  description: "Verification control command"
};
