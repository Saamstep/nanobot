exports.run = async (client, message, args, INPUT_TAG) => {
  //init vars
  const fetch = require("node-fetch");
  const platforms = ["pc", "xbl", "psn", "nintendo-switch"];
  const regions = ["us", "eu", "kr"];
  let inputBattleTag = null;
  let region = "us";
  let platform = "pc";

  //figure out what field is what
  args.forEach(element => {
    if (regions.some(region => element == region)) {
      region = element;
    } else if (platforms.some(platform => element == platform)) {
      platform = element;
    } else if (element.includes("#")) {
      inputBattleTag = element;
    }
  });

  //allows us to figure out if they did everything right
  if (inputBattleTag == null) {
    return client.error("That is an invalid battletag", message);
  }
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
            description: `\`\`\`${json.error}\`\`\``,
            author: {
              name: "Stats Error",
              icon_url: "https://samstep.net/bots/assets/error.png"
            }
          }
        });
      function getTop3(heroes) {
        let top3 = [];
        for (hero in heroes) {
          let time = heroes[hero].timePlayed.split(":");
          switch (time.length) {
            case 3:
              top3.unshift(`${heroes[hero]} - ${heroes[hero].timePlayed}`);
              break;
            case 2:
              top3.push();
              break;
            case 1:
              break;
          }
        }
        console.log(top3);
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
        // getTop3(json.competitiveStats.topHeroes);
      }
      let embed = {
        description: `[OverBuff](https://overbuff.com/players/${platform}/${inputBattleTag.replace("#", "-")}) **|** [op.gg](https://overwatch.op.gg/search/?playerName=${inputBattleTag})`,
        color: 16358669,
        footer: {
          text: json.private ? `Profile is private, limited stats avaliable | Overwatch Competitive Stats` : `Overwatch Stats`
        },
        thumbnail: {
          url: ""
        },
        author: {
          name: `Stats for ${json.name}`,
          icon_url: json.icon
        },
        fields: f
      };
      loadingMessage.edit({ embed });
    })
    .catch(err => console.error(err));
};
exports.cmd = {
  enabled: true,
  category: "Games",
  level: 0,
  description: "Overwatch Stats"
};
