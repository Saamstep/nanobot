exports.run = async (client, message, args) => {
  const fetch = require('node-fetch');
  //OWL Team Logos
  function logos(output) {
    const emoji = client.emojis.find(emoji => emoji.name === `${output}`);
    return emoji;
  }

  switch (args[0]) {
    case 'ranking':
      try {
        const response = await fetch('https://api.overwatchleague.com/ranking');
        const body = await response.json();
        let rank = '';
        for (j in body.content) {
          rank += `\`${parseInt(j) + 1}.\` ${logos(
            body.content[j].competitor.abbreviatedName
          )} ${body.content[j].competitor.name}\n`;
        }
        const embed = {
          color: 16752385,
          author: {
            name: 'OverwatchLeague Standings',
            icon_url:
              'https://static-cdn.jtvnw.net/jtv_user_pictures/8c55fdc6-9b84-4daf-a33b-cb318acbf994-profile_image-300x300.png'
          },
          footer: {
            text: 'Overall for entire League'
          },
          description: `${rank}`,
          timestamp: Date.now()
        };

        message.channel.send({ embed });
      } catch (e) {
        client.error(e, message);
      }
      break;
    case 'news':
      try {
        //fetch news from official API
        const response = await fetch('https://api.overwatchleague.com/news');
        const body = await response.json();
        const embed = {
          description: `**${body.blogs[0].title}**\n${
            body.blogs[0].summary
          }\n\n[Read more](${body.blogs[0].defaultUrl})`,
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
        message.channel.send({ embed });
      } catch (e) {
        client.error(e, message);
      }
      break;
    case 'live':
      function isEmpty(obj) {
        for (var key in obj) {
          if (obj.hasOwnProperty(key)) return false;
        }
        return true;
      }
      //we use try incase the api doesn't exist and the bot crashes :P
      try {
        //fetch news from official API
        const response = await fetch(
          'https://api.overwatchleague.com/live-match'
        );
        const body = await response.json();
        //it wasn't announced, so we annoucne it with this code
        // Finds channel and sends msg to channel
        if (isEmpty(body.data.liveMatch)) {
          return client.error('No live match data.', message);
        } else {
          const embed = {
            description: `${logos(
              body.data.liveMatch.competitors[0].abbreviatedName
            )} **${body.data.liveMatch.competitors[0].name}** vs ${logos(
              body.data.liveMatch.competitors[1].abbreviatedName
            )} **${body.data.liveMatch.competitors[1].name}**`,
            url: `https://twitch.tv/overwatchleague`,
            color: 16752385,
            fields: [
              {
                name: 'Date & Time',
                value: `${new Date(body.data.liveMatch.startDate)}`
              },
              {
                name: 'Score',
                value: `||${body.data.liveMatch.scores[0].value} - ${
                  body.data.liveMatch.scores[1].value
                }||`
              }
            ],
            author: {
              name: 'OverwatchLeague Live',
              icon_url:
                'https://static-cdn.jtvnw.net/jtv_user_pictures/8c55fdc6-9b84-4daf-a33b-cb318acbf994-profile_image-300x300.png'
            }
          };
          message.channel.send({ embed });
        }
      } catch (e) {
        console.error(e);
      }
      break;
    case 'teams':
      try {
        const response = await fetch('https://api.overwatchleague.com/teams');
        const body = await response.json();
        let teamList = '';
        for (j in body.competitors) {
          teamList += `- ${logos(
            body.competitors[j].competitor.abbreviatedName
          )} ${body.competitors[j].competitor.name}\n`;
        }
        const embed = {
          color: 16752385,
          author: {
            name: 'OverwatchLeague Teams',
            icon_url:
              'https://static-cdn.jtvnw.net/jtv_user_pictures/8c55fdc6-9b84-4daf-a33b-cb318acbf994-profile_image-300x300.png'
          },
          footer: {
            text: 'List of all current OWL teams.'
          },
          description: `${teamList}`,
          timestamp: Date.now()
        };
        message.channel.send({ embed });
      } catch (e) {
        console.error(e);
      }
      break;
    case 'team':
      message.reply('WIP');
      break;
    case 'player':
      message.reply('WIP');
      break;
    default:
      message.channel.send(
        `\`\`\`${
          client.ConfigService.config.prefix
        }owl [ranking/stages/news/live/teams/team/player] [search term (if applies to query)]\`\`\``
      );
  }
};
exports.description = 'OverwatchLeague command';
