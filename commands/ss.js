exports.run = (client, message, args) => {
  let header = message.guild.roles.find((r) => r.name == "⫷SS Teams⫸").calculatedPosition;
  let footer = message.guild.roles.find((r) => r.name == "⫷TAGS⫸").calculatedPosition;
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
      if (list.length == 0) return client.error("No registered teams in Discord roles", message);
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
          role.setPosition(footer + 1).then((role) => {
            message.guild.channels.find((ch) => ch.name == "Spring Series 2020 VALORANT" && ch.type == "category").overwritePermissions(role.id, { READ_MESSAGES: true });
          });
        });
      client.log("Spring Series Team", `Team Created **${schoolName}**`, 6800070, message, client);
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
            client.log("Spring Series Team", `Added **${s.user}** to team **${teamName}**`, 6800070, message, client);
          });
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
    default:
      const helpText = `*Spring Series Team Management Command*\n${client.ConfigService.config.prefix}sjs list -> lists all teams\n${client.ConfigService.config.prefix}sjs add [Team Name] -> Adds a new team (sets up roles/channels)\n${client.ConfigService.config.prefix}sjs join (Team Name) @user @user2 @user3... -> adds user(s) to specified team in parentheticals\n${client.ConfigService.config.prefix}sjs announce [announcement] --> Sends announcement to each team channel and pins message.\n${client.ConfigService.config.prefix}sjs chperms (Role) {PermissionOverwriteOptions}`;
      message.channel.send(`\`\`\`${helpText}\`\`\``);
      break;
  }
};
exports.cmd = {
  enabled: true,
  category: "Utility",
  level: 2,
  description: "[Spring Series] Adds a new team, sets up role and channel for said team.",
};
