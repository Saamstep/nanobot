exports.run = (client, message, args, veriEnmap, cc) => {
  const dateFormat = require("dateformat");
  //uses first arg to grab profile OR author of message
  let user = message.mentions.members.first() || message.member;
  //default profile if none set
  const defaultProfile = {
    bio: "Hello there.",
    socials: "None"
  };

  var teams = [];
  var data;

  let allTeams = [
    "OW Team Blue",
    "OW Team White",
    "RL Team Blue",
    "RL Team White"
  ];
  console.log(veriEnmap.get(user.id, "profile"));
  // change settings args handler
  switch (args[0]) {
    case "set":
      switch (args[1]) {
        case "bio":
          let newBio = args
            .join(" ")
            .replace("set bio", " ")
            .trim();
          veriEnmap.defer.then(() => {
            veriEnmap.set(user.id, newBio, "profile.bio");
          });
          break;
        case "teams":
          return message.channel.send("You cannot edit this property!");
          break;
        case "socials":
          let socials = ["YouTube", "Instagram", "Twitter"];
          switch (args[2]) {
            case "add":
              if (!args[3]) return client.error("Provide a URL!", message);
              //make sure its a good social site
              if (socials.indexOf(args[2]) > -1) {
                //social url checker
                if (
                  !args[3].includes(
                    socials[socials.indexOf(args[2])].toLowerCase()
                  ) ||
                  !args[3].includes("https")
                )
                  return client.error(
                    "That doesn't look right! Make sure its a well formatted URL",
                    message
                  );
                //push final result
                if (veriEnmap.has(user.id, "profile.socials")) {
                  veriEnmap.push(
                    user.id,
                    `[${socials.indexOf(args[2])}](${args[3]})`,
                    "profile.socials"
                  );
                } else {
                  veriEnmap.set(
                    user.id,
                    [`[${socials[socials.indexOf(args[2])]}](${args[3]})`],
                    "profile.socials"
                  );
                }
              }
              break;
            case "remove":
              if (!args[4])
                return client.error(
                  "Specify an index to remove! (Ex: to remove the first social link use the number 1"
                );
              veriEnmap.remove(
                user.id,
                `${veriEnmap.get(user.id, "profile.socials")[args[4]]}`,
                "profile.socials"
              );
              break;
            default:
              message.channel.send(
                `Socials List:\n\`\`\`${veriEnmap
                  .get(user.id, "profile.socials")
                  .join("\n") || defaultProfile.socials}\`\`\``
              );
          }
          message.channel.send(
            `Added ${socials[socials.indexOf(args[2])]} to list of socials.`
          );
          break;
        default:
          message.channel.send("That property does not exist!");
      }
      break;
    //if settings dont want to be changed just return profile
    default:
      veriEnmap.defer.then(() => {
        if (veriEnmap.has(user.id)) {
          data = veriEnmap.ensure(user.id, defaultProfile, "profile");
        } else {
          client.error(
            "That user is not verified, please fill out the Discord verification form.",
            message
          );
        }
        user.roles.forEach(r => {
          if (allTeams.indexOf(r.name) > -1) {
            teams.push(`${r.name}`);
          }
        });
        //discord account stats
        let joined = dateFormat(user.joinedAt, "mmmm dS, yyyy h:MM:ss TT");
        let age = dateFormat(user.user.createdAt, "mmmm dS, yyyy h:MM:ss TT");
        //embed message (replace with image soon)
        const embed = {
          color: 10644181,
          footer: {
            icon_url: `${client.user.avatarURL}`,
            text: client.user.username + " - Profiles"
          },
          author: {
            name: `${user.user.username} | ${veriEnmap.get(user.id, "name")}`,
            icon_url: `${user.user.avatarURL}`
          },
          fields: [
            {
              name: "Bio",
              value: data.bio || defaultProfile.bio
            },
            {
              name: "Teams",
              value: teams.join("\n") || "No HSEL teams"
            },
            {
              name: "Socials",
              value: data.socials.join("\n") || defaultProfile.socials
            },
            {
              name: "Account Age",
              value: age,
              inline: true
            },
            {
              name: "Joined",
              value: joined,
              inline: true
            }
          ]
        };
        //send profile
        message.channel.send({ embed });
      });
  }
};
exports.cmd = {
  enabled: true,
  category: "Fun",
  level: 0,
  description: "Create/view your profile"
};
