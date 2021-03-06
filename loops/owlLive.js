exports.run = (client, dupe, sendMessage) => {
  const fetch = require("node-fetch");
  //OWL Live-Match

  async function owlLiveMatch() {
    client.console("OWL | Checking for OWL live match...".yellow);
    function logos(output) {
      const emoji = client.emojis.find(emoji => emoji.name === `${output}`);
      return emoji;
    }
    //we use try incase the api doesn't exist and the bot crashes :P
    try {
      //fetch news from official API
      const response = await fetch("https://api.overwatchleague.com/live-match");
      const body = await response.json();
      //check to see if we already announced the lastest article
      dupe.defer.then(() => {
        if (dupe.get("live") === body.data.liveMatch.id) {
          //if announced, skip it (:
          return client.console(`Already announced ${body.data.liveMatch.id}`.yellow);
        } else {
          function isEmpty(obj) {
            for (var key in obj) {
              if (obj.hasOwnProperty(key)) return false;
            }
            return true;
          }
          if (isEmpty(body.data.liveMatch)) {
            return client.console("No live match data.");
          }
          dupe.set("live", body.data.liveMatch.id);
          //it wasn't announced, so we announce it with this code
          // Finds channel and sends msg to channel
          // client.guilds.map(guild => {
          //   if (guild.available) {
          //     let channel = guild.channels.find(channel => channel.name === `${client.ConfigService.config.channel.owl}`);
          //     if (channel) {
          //       channel.send({ embed });
          //     }
          //   }
          // });

          const embed = {
            description: `${logos(body.data.liveMatch.competitors[0].abbreviatedName)} **${body.data.liveMatch.competitors[0].name}** vs ${logos(body.data.liveMatch.competitors[1].abbreviatedName)} **${body.data.liveMatch.competitors[1].name}**`,
            url: `https://twitch.tv/overwatchleague`,
            color: 16752385,
            fields: [
              {
                name: "Date & Time",
                value: `${new Date(body.data.liveMatch.startDate)}`
              }
            ],
            author: {
              name: "OverwatchLeague Live",
              icon_url: "http://samstep.net/bots/assets/owl.png"
            }
          };

          sendMessage(client.ConfigService.config.channel.owl, { embed });
        }
      });
    } catch (e) {
      client.console(e);
    }
  }
  owlLiveMatch();
};
exports.time = 280000;
