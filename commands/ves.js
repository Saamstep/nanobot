exports.run = (client, message, args) => {
  message.channel.startTyping(1);
  const fetch = require("node-fetch");
  const errorMod = require("../modules/errorMod.js");
  const ConfigService = require("../config.js");

  switch (args[0]) {
    case "club":
      async function teamCmd() {
        try {
          const response = await fetch(`https://mobile.varsityesports.com/api/club/${args[1]}`, {});
          const body = await response.json();
          const embed = {
            description: `Club page [here](https://mobile.varsityesports.com/club/${args[1]})`,
            url: `https://mobile.varsityesports.com/club/${args[1]}`,
            color: 16460832,
            footer: {
              icon_url: "http://samstep.net/bots/assets/ves.png",
              text: "https://varsityesports.com"
            },
            author: {
              name: "Team Lookup",
              url: "http://www.mobile.varsityesports.com/club/" + args[1],
              icon_url: "http://samstep.net/bots/assets/hsel.png"
            },
            fields: [
              {
                name: "Club Name",
                value: `${body.clubName}`
              },
              {
                name: "School Name",
                value: `${body.schoolName}`
              },
              {
                name: "State",
                value: `${body.state}`
              }
            ]
          };
          message.channel.send({ embed });
        } catch (e) {
          errorMod("Could not reach Varsity API, contact the bot owner", message);
        }
      }
      teamCmd();
      break;
    case "roster":
      async function rosterCmd() {
        try {
          const response = await fetch(`https://mobile.varsityesports.com/api/club/0/roster/${args[1]}`, {});
          const body = await response.json();
          let rosterList = " ";
          for (let j in body.rosterPositions) {
            rosterList += `- ` + body.rosterPositions[j].firstName + " " + body.rosterPositions[j].lastName + ".\n";
          }

          const embed = {
            description: `Roster page [here](https://mobile.varsityesports.com/club/${body.clubId}/roster/${args[1]})`,
            url: `https://mobile.varsityesports.com/club/${body.clubId}/roster/${args[1]}`,
            color: 16460832,
            footer: {
              icon_url: "http://samstep.net/bots/assets/ves.png",
              text: "https://varsityesports.com"
            },
            author: {
              name: "Roster Lookup",
              url: `https://mobile.varsityesports.com/club/${body.clubId}/roster/${args[1]}`,
              icon_url: "http://samstep.net/bots/assets/hsel.png"
            },
            fields: [
              {
                name: `${body.rosterName}`,
                value: `${rosterList}`
              },
              {
                name: "Created at",
                value: `${body.created}`
              },
              {
                name: "Modified at",
                value: `${body.modified}`
              }
            ]
          };
          message.channel.send({ embed });
        } catch (e) {
          errorMod("Could not reach Varsity API, contact the bot owner", message);
          console.error(e);
        }
      }
      rosterCmd();
    case "tournament":
      // shortforms for games...

      async function tourneyCmd() {
        try {
          if (!args[1] && args[0] == "tournament") {
            return errorMod("Please provide a game to search.", message);
          }
          const response = await fetch(`https://mobile.varsityesports.com/api/toornament`, {});
          const body = await response.json();
          let tourneys = " ";
          for (let j in body) {
            if (body[j].name.includes(args[1])) {
              tourneys += `[**${body[j].name}**](https://toornament.com/tournaments/${body[j].id}/stages/)\n`;
            }
          }

          if (tourneys == " " && args[0] == "tournament") {
            tourneys = "No results.";
          }
          const embed = {
            description: `View all tournaments [here](https://mobile.varsityesports.com/toornaments)`,
            url: `https://mobile.varsityesports.com/toornaments`,
            color: 16460832,
            footer: {
              icon_url: "http://samstep.net/bots/assets/ves.png",
              text: "https://varsityesports.com"
            },
            author: {
              name: "Tournaments",
              url: `https://mobile.varsityesports.com/toornaments`,
              icon_url: "http://samstep.net/bots/assets/hsel.png"
            },
            fields: [
              {
                name: `🔍 Search Results`,
                value: `${tourneys}`
              }
            ]
          };

          message.channel.send({ embed });
        } catch (e) {
          errorMod("Could not reach Varsity API, contact the bot owner", message);
          console.error(e);
        }
      }
      tourneyCmd();
      break;
    default:
      message.channel.send(`\`\`\`${ConfigService.config.prefix}varsity [club/roster/tournament] [club ID/roster ID/game search]\`\`\``);
      break;
  }
};

exports.cmd = {
  enabled: false,
  category: "VCHS Esports",
  level: 1,
  description: "Varsity Esports interaction with Discord.(Some features do not work)"
};
