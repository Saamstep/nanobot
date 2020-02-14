exports.run = async (client, message, args, INPUT_TAG) => {
  //init vars
  const fetch = require("node-fetch");
  let battleTags = args;
  let region = "us";
  let platform = "pc";

  //allows us to figure out if they did everything right
  if (battleTags.length < 1) {
    return client.error("That is an invalid battletag", message);
  }

  function getRankIcon(sr) {
    if (sr >= 4000) {
      return client.emojis.get("677209282441117706");
    } else if (sr < 4000 && sr >= 3500) {
      return client.emojis.get("677209282646638612");
    } else if (sr < 3500 && sr >= 3000) {
      return client.emojis.get("677209282671935509");
    } else if (sr < 3000 && sr >= 2500) {
      return client.emojis.get("677209282394980374");
    } else if (sr < 2500 && sr >= 2000) {
      return client.emojis.get("677209282097446946");
    } else if (sr < 2000 && sr > 1500) {
      return client.emojis.get("677209282546237450");
    } else if (sr <= 1500) {
      return client.emojis.get("677209282143322117");
    } else {
      return "❔";
    }
  }
  message.delete(100);
  battleTags.forEach(function(inputBattleTag) {
    message.channel
      .send({
        embed: {
          description: `Getting stats for **${inputBattleTag}**  in region **${region.toUpperCase()}** on platform **${platform.toUpperCase()}** this may take some time...`,
          author: {
            name: "Loading",
            icon_url: "https://samstep.net/bots/assets/loading.gif"
          }
        }
      })
      .then(async loadingMessage => {
        const getJSON = await fetch(`https://ow-api.com/v1/stats/${platform}/${region}/${inputBattleTag.replace("#", "-")}/complete`);
        const json = await getJSON.json();
        if (json.error)
          return loadingMessage.edit({
            embed: {
              description: `\`\`\`${json.error} for player ${inputBattleTag}\`\`\``,
              author: {
                name: "Stats Error",
                icon_url: "https://samstep.net/bots/assets/error.png"
              }
            }
          });

        let f = json.private
          ? [{ name: "Level", value: json.prestige * 100 + json.level, inline: true }]
          : [
              { name: "Level", value: json.prestige * 100 + json.level, inline: true },
              { name: "WinRate", value: Math.round((json.competitiveStats.games.won / json.competitiveStats.games.played) * 100) + "%", inline: true },
              { name: "AVG SR", value: `${getRankIcon(json.rating)} ${json.rating}` }
            ];

        if (!json.private) {
          json.ratings.forEach(role => {
            f.push({ name: role.role.substring(0, 1).toUpperCase() + role.role.substring(1, role.role.length), value: getRankIcon(role.level) + " " + role.level });
          });
        }
        let embed = {
          description: `[OverBuff](https://overbuff.com/players/${platform}/${inputBattleTag.replace("#", "-")}) **|** [op.gg](https://overwatch.op.gg/search/?playerName=${inputBattleTag})`,
          color: 16358669,
          footer: {
            text: json.private ? `Profile is private, limited stats avaliable | Overwatch Competitive Stats` : `Overwatch Stats`
          },
          image: {
            url: "https://samstep.net/bots/assets/overbuff.png"
          },
          author: {
            name: `Stats for ${json.name}`,
            icon_url: json.icon
          },
          fields: f
        };
        loadingMessage.edit({ embed });

        const filter = (reaction, user) => {
          return ["📷"].includes(reaction.emoji.name) && user.id === message.author.id;
        };
        loadingMessage.react("📷");
        loadingMessage.awaitReactions(filter, { max: 1, time: 60000, errors: ["time"] }).then(collected => {
          loadingMessage.reactions.forEach(reaction => reaction.remove());
          const waitFilter = m => m.author.id != loadingMessage.author.id;
          message.channel
            .awaitMessages(waitFilter, {
              max: 1,
              time: 10000,
              errors: ["time"]
            })
            .then(collected => {
              // console.log(collected.first().attachments.first().url);
              message.channel.fetchMessage(loadingMessage.id).then(msg => {
                let dupe = msg.embeds[0];
                dupe.image.url = collected.first().attachments.first().url;
                msg.edit(new client.Discord.RichEmbed(dupe)).then(m => {
                  collected.first().delete();
                });
              });
            })
            .catch(function(err) {
              console.log(err);
              client.error("Image uploader timed out.", message);
            });
        });
      })
      .catch(err => console.error(err));
  });
};
exports.cmd = {
  enabled: true,
  category: "VCHS Esports",
  level: 3,
  description: "Overwatch scouting stats"
};
