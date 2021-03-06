exports.run = (client, message, args) => {
  let header = message.guild.roles.find((r) => r.name == "—TEAMS—").calculatedPosition;
  let footer = message.guild.roles.find((r) => r.name == "—TAGS—").calculatedPosition;
  let modCategory = message.guild.channels.find((ch) => ch.name == "Moderation" && ch.type == "category").calculatedPosition;
  function getAllTeams() {
    let list = [];
    message.guild.roles.array().forEach((role) => {
      // console.log(role.name + "===" + role.calculatedPosition + "<" + header && role.calculatedPosition + ">" + footer);
      if (role.calculatedPosition < header && role.calculatedPosition > footer) {
        list.push(role.name);
      }
    });
    return list;
  }
  switch (args[0]) {
    case "list":
      let list = getAllTeams();
      if (list.length == 0) return client.error("No registered schools in Discord roles", message);
      let chunk = "";
      list.forEach((role) => {
        // console.log(role.name + "===" + role.calculatedPosition + "<" + header && role.calculatedPosition + ">" + footer);
        chunk += "- " + role + "\n";
      });
      message.channel.send("```\n" + chunk + "```");
      break;
    case "add":
      let schoolName = args.join(" ").replace("add", "").trim();
      if (getAllTeams().indexOf(schoolName) > -1) return client.error("That team already exists!", message);
      message.guild
        .createRole({
          name: schoolName,
          permissions: 0,
        })
        .then((role) => {
          role.setPosition(footer + 1).then(() => {
            role.setHoist(true).then(() => {
              message.guild
                .createChannel(schoolName, {
                  type: "category",
                  position: 0,
                  permissionOverwrites: [
                    //add bots and organizer to see this
                    { id: role.id, allow: ["READ_MESSAGES"] },
                    { id: message.guild.roles.find((r) => r.name == "League of Legends Captain").id, allow: ["MANAGE_MESSAGES", "MENTION_EVERYONE"] },
                    { id: message.guild.roles.find((r) => r.name == client.ConfigService.config.roles.mod).id, allow: ["READ_MESSAGES"] },
                    { id: message.guild.roles.find((r) => r.name == client.ConfigService.config.roles.bot).id, allow: ["READ_MESSAGES"] },
                    { id: message.guild.id, deny: ["READ_MESSAGES"] },
                  ],
                })
                .then((category) => {
                  message.guild.createChannel(schoolName, { type: "text" }).then(async (tc) => {
                    await tc.setParent(category.id);
                    await tc.lockPermissions();
                    await tc
                      .send(
                        `This category has been specially created for **${schoolName}** to discuss and strategize during the tournament. As specified in the rules, you **MUST** use the provided voice channel below to comm during the game. This will allow for smooth communication with the tournament admins and to keep competitive integrity for the tournament. Please take time to review the rules and make sure you have submitted proof forms as specified in the rules.\n\n__Links__\n→**Rules** <https://rules.sanjoseshowdown.com>\n→**Proof Form** <https://proof.sanjoseshowdown.com>\n→**Invite Team Here** <https://discord.sanjoseshowdown.com>\n→**About** <https://sanjoseshowdown.com>`
                      )
                      .then((m) => m.pin());
                  });
                  message.guild.createChannel(schoolName, { type: "voice" }).then(async (tc) => {
                    await tc.setParent(category.id);
                    await tc.lockPermissions();
                    await tc.setUserLimit(5);
                    await category.setPosition(modCategory - 1);
                  });
                });
            });
          });
        });
      client.log("SJS Team", `Team Created **${schoolName}**`, 6800070, message, client);
      break;
    case "join":
      message.delete(0);
      let msg = args.join(" ");
      let teamName = msg.substring(msg.indexOf("(") + 1, msg.indexOf(")"));
      message.mentions.users.array().forEach((user) => {
        message.guild
          .member(user)
          .addRole(message.guild.roles.find((r) => r.name == teamName))
          .then((s) => {
            message.channel.send(`Added ${s.user.username} to team **${teamName}**`);
            client.log("SJS Team", `Added **${s.user}** to team **${teamName}**`, 6800070, message, client);
          });
      });
      break;
    case "announce":
      if (!args[1]) return client.error("Please make announcement longer", message);
      getAllTeams().forEach((team) => {
        let chName = team.replace(/\s+/g, "-").toLowerCase();
        try {
          message.guild.channels
            .find((ch) => ch.name == chName)
            .send(args.join(" ").slice(9))
            .then((msg) => {
              msg.pin();
            });
        } catch (e) {
          client.error(`Error with channel ${chName}: \`${e}\``);
        }
      });
      break;
    case "chperms":
      try {
        let permsObject = JSON.parse(args.join(" ").substring(args.join(" ").indexOf("{"), args.join(" ").indexOf("}") + 2));
        let roleFind = args.join(" ").substring(args.join(" ").indexOf("(") + 1, args.join(" ").indexOf(")"));
        let allTeams = getAllTeams();
        allTeams.forEach((team) => {
          message.guild.channels.find((ch) => ch.name == team && ch.type == "category").overwritePermissions(message.guild.roles.find((r) => r.name == roleFind).id, permsObject);
        });
      } catch (e) {
        return client.error(`\`\`\`${e}\`\`\``, message);
      }
      message.channel.send(`Updated permissions for role **${roleFind}** in \`${allTeams.length}\` team categories.`);
      break;
    case "vcCount":
      getAllTeams().forEach((team) => {
        message.guild.channels.find((ch) => ch.name == team && ch.type == "voice").setUserLimit(args[1]);
      });
      break;
    default:
      const helpText = `*San Jose Showdown Server Management Command*\n${client.ConfigService.config.prefix}sjs list -> lists all teams\n${client.ConfigService.config.prefix}sjs add [Team Name] -> Adds a new team (sets up roles/channels)\n${client.ConfigService.config.prefix}sjs join (Team Name) @user @user2 @user3... -> adds user(s) to specified team in parentheticals\n${client.ConfigService.config.prefix}sjs announce [announcement] --> Sends announcement to each team channel and pins message.\n${client.ConfigService.config.prefix}sjs chperms (Role) {PermissionOverwriteOptions}\n${client.ConfigService.config.prefix}sjs vcCount [maxUsersInVC]`;
      message.channel.send(`\`\`\`${helpText}\`\`\``);
      break;
  }
};
exports.cmd = {
  enabled: true,
  category: "Utility",
  level: 2,
  description: "[San Jose Showdown] Adds a new team, sets up role and channel for said team.",
};
