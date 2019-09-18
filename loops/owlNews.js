exports.run = (client, dupe, sendMessage) => {
  const fetch = require('node-fetch');
  //OWL Team Logos
  function logos(output) {
    const emoji = client.emojis.find(emoji => emoji.name === `${output}`);
    return emoji;
  }

  //OWL News
  async function owlNews() {
    client.console('OWL | Checking for OWL news...'.yellow);

    //we use try incase the api doesn't exist and the bot crashes :P
    try {
      //fetch news from official API
      const response = await fetch('https://api.overwatchleague.com/news');
      const body = await response.json();
      //check to see if we already announced the lastest article
      dupe.defer.then(() => {
        if (dupe.get('news') === body.blogs[0].blogId) {
          //if announced, skip it (:
          return client.console(`Already announced ${body.blogs[0].blogId}`.yellow);
        } else {
          dupe.set('news', body.blogs[0].blogId);
          //it wasn't announced, so we annoucne it with this code
          // Finds channel and sends msg to channel
          const embed = {
            description: `**${body.blogs[0].title}**\n${body.blogs[0].summary}\n\n[Read more](${body.blogs[0].defaultUrl})`,
            url: `${body.blogs[0].defaultUrl}`,
            color: 16752385,
            timestamp: body.blogs[0].publish,
            footer: {
              text: `Author: ${body.blogs[0].author}`
            },
            image: {
              url: `${body.blogs[0].thumbnail.url.replace('//', 'https://')}`
            },
            author: {
              name: 'OverwatchLeague News',
              url: `${body.blogs[0].defaultUrl}`,
              icon_url:
                'https://static-cdn.jtvnw.net/jtv_user_pictures/8c55fdc6-9b84-4daf-a33b-cb318acbf994-profile_image-300x300.png'
            }
          };
          // client.guilds.map(guild => {
          //   if (guild.available) {
          //     let channel = guild.channels.find(channel => channel.name === `${client.ConfigService.config.channel.owl}`);
          //     if (channel) {

          //       channel.send({ embed });
          //     }
          //   }
          // });
          client.guilds.forEach(function(g) {
            sendMessage(client.ConfigService.config.channel.owl, { embed });
          });
        }
      });
    } catch (e) {
      client.console(e);
    }
  }
  owlNews();
};

exports.time = 280000;
