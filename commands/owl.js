exports.run = async (client, message, args) => {
  const fetch = require("node-fetch");
  //OWL Team Logos
  function logos(output) {
    const emoji = client.emojis.find(emoji => emoji.name === `${output}`);
    return emoji;
  }

  switch (args[0]) {
    case "ranking":
      try {
        const response = await fetch("https://api.overwatchleague.com/ranking");
        const body = await response.json();
        let rank = "";
        for (j in body.content) {
          rank += `\`${parseInt(j) + 1}.\` ${logos(body.content[j].competitor.abbreviatedName)} ${body.content[j].competitor.name}\n`;
        }
        const embed = {
          color: 16752385,
          author: {
            name: "OverwatchLeague Ranking",
            icon_url: "http://samstep.net/bots/assets/owl.png"
          },
          footer: {
            text: "Overall for entire League"
          },
          description: `${rank}`,
          timestamp: Date.now()
        };

        message.channel.send({ embed });
      } catch (e) {
        client.error(e, message);
      }
      break;
    case "news":
      try {
        //fetch news from official API
        const response = await fetch("https://api.overwatchleague.com/news");
        const body = await response.json();
        const embed = {
          description: `**${body.blogs[0].title}**\n${body.blogs[0].summary}\n\n[Read more](${body.blogs[0].defaultUrl})`,
          url: `${body.blogs[0].defaultUrl}`,
          color: 16752385,
          timestamp: body.blogs[0].publish,
          footer: {
            text: `Author: ${body.blogs[0].author}`
          },
          image: {
            url: `${body.blogs[0].thumbnail.url.replace("//", "https://")}`
          },
          author: {
            name: "OverwatchLeague News",
            url: `${body.blogs[0].defaultUrl}`,
            icon_url: "http://samstep.net/bots/assets/owl.png"
          }
        };
        message.channel.send({ embed });
      } catch (e) {
        client.error(e, message);
      }
      break;
    case "live":
      function isEmpty(obj) {
        for (var key in obj) {
          if (obj.hasOwnProperty(key)) return false;
        }
        return true;
      }
      //we use try incase the api doesn't exist and the bot crashes :P
      try {
        //fetch news from official API
        const response = await fetch("https://api.overwatchleague.com/live-match");
        const body = await response.json();
        //it wasn't announced, so we annoucne it with this code
        // Finds channel and sends msg to channel
        if (isEmpty(body.data.liveMatch)) {
          return client.error("No live match data.", message);
        } else {
          const embed = {
            description: `${logos(body.data.liveMatch.competitors[0].abbreviatedName)} **${body.data.liveMatch.competitors[0].name}** vs ${logos(body.data.liveMatch.competitors[1].abbreviatedName)} **${body.data.liveMatch.competitors[1].name}**`,
            url: `https://twitch.tv/overwatchleague`,
            color: 16752385,
            fields: [
              {
                name: "Date & Time",
                value: `${new Date(body.data.liveMatch.startDate)}`
              },
              {
                name: "Score",
                value: `||${body.data.liveMatch.scores[0].value} - ${body.data.liveMatch.scores[1].value}||`
              }
            ],
            author: {
              name: "OverwatchLeague Live",
              icon_url: "http://samstep.net/bots/assets/owl.png"
            }
          };
          message.channel.send({ embed });
        }
      } catch (e) {
        console.error(e);
      }
      break;
    case "teams":
      try {
        const response = await fetch("https://api.overwatchleague.com/teams");
        const body = await response.json();
        let teamList = "";
        for (j in body.competitors) {
          teamList += `- ${logos(body.competitors[j].competitor.abbreviatedName)} ${body.competitors[j].competitor.name}\n`;
        }
        const embed = {
          color: 16752385,
          author: {
            name: "OverwatchLeague Teams",
            icon_url: "http://samstep.net/bots/assets/owl.png"
          },
          footer: {
            text: "List of all current OWL teams."
          },
          description: `${teamList}`,
          timestamp: Date.now()
        };
        message.channel.send({ embed });
      } catch (e) {
        console.error(e);
      }
      break;
    case "team":
      try {
        const response = await fetch("https://api.overwatchleague.com/teams");
        const body = await response.json();
        for (j in body.competitors) {
          if (body.competitors[j].competitor.name.includes(args[1])) {
            let players = "";
            for (i in body.competitors[j].competitor.players) {
              players += `\:flag_${body.competitors[j].competitor.players[i].player.nationality.toLowerCase()}: ${body.competitors[j].competitor.players[i].player.name}\n`;
            }
            let media = "";
            for (k in body.competitors[j].competitor.accounts) {
              media += `[${body.competitors[j].competitor.accounts[k].accountType}](${body.competitors[j].competitor.accounts[k].value})\n`;
            }
            const embed = {
              url: "https://discordapp.com",
              color: parseInt(body.competitors[j].competitor.primaryColor, 16),
              footer: {
                text: "OverwatchLeague Team Search"
              },
              thumbnail: {
                url: `${body.competitors[j].competitor.logo}`
              },
              author: {
                name: `${body.competitors[j].competitor.name}`,
                icon_url: `http://samstep.net/bots/assets/owl.png`
              },
              fields: [
                {
                  name: "Home Location",
                  value: `${body.competitors[j].competitor.homeLocation}`
                },
                {
                  name: "Players",
                  value: `${players}`
                },
                {
                  name: "Social Media",
                  value: `${media}`
                }
              ]
            };
            message.channel.send({ embed });
          }
        }
      } catch (e) {
        console.error(e);
      }
      break;
    case "player":
      const response = await fetch("https://api.overwatchleague.com/players");
      const body = await response.json();
      function role(output) {
        const emoji = client.emojis.find(emoji => emoji.name === `${output}`);
        return emoji;
      }
      for (j in body.content) {
        let media = "";
        for (k in body.content[j].accounts) {
          media += `[${body.content[j].accounts[k].accountType}](${body.content[j].accounts[k].value})\n`;
        }

        if (body.content[j].name.includes(args[1]) || body.content[j].givenName.includes(args[1])) {
          const embed = {
            color: parseInt(body.content[j].teams[0].team.primaryColor, 16),
            footer: {
              text: "OverwatchLeague Player Search"
            },
            thumbnail: {
              url: `${body.content[j].headshot}`
            },

            author: {
              name: `${body.content[j].name} #${body.content[j].attributes.player_number.toString()}`,
              icon_url: `${body.content[j].teams[0].team.logo}`
            },
            fields: [
              {
                name: "Team",
                value: `${body.content[j].teams[0].team.name}`,
                inline: true
              },
              {
                name: "Nationality",
                value: `:flag_${body.content[j].nationality.toLowerCase()}: ${body.content[j].attributes.hometown}`,
                inline: true
              },
              {
                name: `Heroes ${role(body.content[j].attributes.role)}`,
                value: `${body.content[j].attributes.heroes.join("\n")}`,
                inline: true
              },
              {
                name: "Social Media",
                value: `${media}`
              }
            ]
          };
          message.channel.send({ embed });
        }
      }
      break;
    case "standings":
      try {
        const res = await fetch("https://api.overwatchleague.com/standings");
        const data = await res.json();
        let standingsList = "";
        for (j in data.stages[3].teams) {
          standingsList += `\`${parseInt(j) + 1}.\` ${logos(data.stages[3].teams[j].abbreviatedName)} ${data.stages[3].teams[j].name}\n`;
        }
        const embed = {
          color: 16752385,
          author: {
            name: "OverwatchLeague Standings",
            icon_url: "http://samstep.net/bots/assets/owl.png"
          },
          footer: {
            text: "Stage 3 Standings"
          },
          description: `${standingsList}`,
          timestamp: Date.now()
        };

        message.channel.send({ embed });
      } catch (e) {
        console.error(e);
      }
      break;
    case "matches":
      const owl_Matches = await fetch("https://api.overwatchleague.com/matches");
      const allMatches = await owl_Matches.json();
      let matches = "";
      for (j = 0; j < 5; j++ in allMatches.content) {
        matches += `${logos(allMatches.content[j].competitors[0].abbreviatedName)} **${allMatches.content[j].competitors[0].name}** vs **${allMatches.content[j].competitors[1].name}** ${logos(
          allMatches.content[j].competitors[1].abbreviatedName
        )}\n Score: ||**${allMatches.content[j].scores[0].value}** - **${allMatches.content[j].scores[1].value}**||\n\n`;
      }
      const embed = {
        description: `${matches}`,
        color: 16752385,
        author: {
          name: "OverwatchLeague Matches",
          icon_url: "http://samstep.net/bots/assets/owl.png"
        },
        timestamp: Date.now(),
        footer: {
          text: "3 Recent Matches"
        }
      };
      message.channel.send({ embed });
      break;
    default:
      message.channel.send(
        `\`\`\`${client.ConfigService.config.prefix}owl [option] [search(if applicable)]
      Options:
      ranking
      stages
      news
      live
      teams
      team   [search]
      player [search]\`\`\``
      );
  }
};
exports.cmd = {
  enabled: true,
  category: "Games",
  level: 0,
  description: "OverwatchLeague information command"
};
