exports.run = async (client, message, args) => {
  // ---Variables---
  const fetch = require('node-fetch');

  let errorMsg =
    'There was an error contacting the API or your BattleTag is invalid.';

  //Delete command call message
  message.delete(0);
  //Check if there is an actual battletag there!
  if (!args[0]) {
    return message.reply('Provide a battle tag please!');
  }
  //Check if we are searching for a battletag, or looking up stats. Battle tag is listed down here (rather han up with --Variables--) b/c it will interfere with the args[0] check!
  let battletag = args[0].replace('#', '-');
  if (!battletag.includes('-')) {
    try {
      const response = await fetch(`https://owjs.ovh/search/${args[0]}`);
      const body = await response.json();
      let searchResults = ' ';
      //Put all the users found in a big variable then send it
      for (let j in body) {
        searchResults += `__**${body[j].name}**__\n${body[
          j
        ].platform.toUpperCase()}\n<https://www.overbuff.com/players/${
          body[j].platform
        }/${body[j].urlName}>\n`;
      }
      message.channel.send(searchResults);
    } catch (e) {
      if (e) {
        error(errorMsg, message);
      }
    }
  } else {
    // Here we are actually finding the stats if a battletag is found.
    // First we need to see if args for region and platform are included
    // if (!args[1] && args[2]) {
    try {
      const request = await fetch(
        `https://ovrstat.com/stats/pc/us/${battletag}`
      );
      const stats = await request.json();
      //Check for private profile before doing anything else!
      if (stats.message) {
        return message.channel.send(':no_entry_sign: | ' + stats.message);
      }
      if (stats.private === true) {
        // Here's the message format for the stats
        const embed = {
          description:
            '[OverBuff](https://overbuff.com/players/pc/' + battletag + ')',
          url: 'https://overbuff.com/players/pc/' + battletag,
          color: 16617745,
          footer: {
            icon_url:
              'https://github.com/s32x/ovrstat/raw/master/static/assets/logo.png',
            text: 'OvrStat'
          },
          thumbnail: {
            url: stats.endorsementIcon
          },
          author: {
            name: stats.name + "'s stats",
            url: 'https://overbuff.com/players/pc/' + battletag,
            icon_url: stats.icon
          },
          fields: [
            {
              name: 'Name',
              value: stats.name
            },
            {
              name: 'Level',
              value: stats.level + stats.prestige * 100
            },
            {
              name: 'Most Recent Rank',
              value:
                '[Click Here](https://overbuff.com/search?q=' + battletag + ')'
            }
          ]
        };
        // We are now sending the formatted message
        return message.channel.send({ embed });
      }
      if (stats.private === false) {
        //If the profile is public, we do this.
        //Here is the code to get the played heros in comp.
        let topHeroes = stats.competitiveStats.topHeroes;
        let pTime = '';
        for (var property in topHeroes) {
          pTime += property + '> ' + topHeroes[property].timePlayed + '\n';
        }
        // console.log(pTime);

        // Here's the message format for the stats
        const embed = {
          description:
            '[OverBuff](https://overbuff.com/players/pc/' + battletag + ')',
          url: 'https://overbuff.com/players/pc/' + battletag,
          color: 16617745,
          footer: {
            icon_url:
              'https://github.com/s32x/ovrstat/raw/master/static/assets/logo.png',
            text: 'OvrStat'
          },
          thumbnail: {
            url: stats.ratingIcon
          },
          author: {
            name: stats.name + "'s stats",
            url: 'https://overbuff.com/players/pc/' + battletag,
            icon_url: stats.icon
          },
          fields: [
            {
              name: 'Name',
              value: stats.name
            },
            {
              name: 'Level',
              value: stats.level + stats.prestige * 100
            },
            {
              name: 'Rank',
              value: stats.rating
            },
            {
              name: 'Playtime',
              value: pTime
            }
          ]
        };
        // We are now sending the formatted message
        return message.channel.send({ embed });
      }
    } catch (e) {
      error(errorMsg, message);
    }
    // } else {
    //   // If region and platform are included then we let them pass to the request api.
    // }
  }
};
exports.description =
  'New Overwatch command with a better API and improved formatting.';
