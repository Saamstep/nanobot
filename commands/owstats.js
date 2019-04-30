//file vars

const ConfigService = require('../config.js');
const errorEvent = require('../modules/errorMod.js');
const fetch = require('node-fetch');

exports.run = async (client, message, args) => {
  const cooldown = require('../index.js');
  async function cmd() {
    message.channel.startTyping(1);

    //vars

    if (!args[0]) {
      return message.channel.send(
        `${ConfigService.config.prefix}ow [user#0000] [region] [platform]\n${
          ConfigService.config.prefix
        }ow [user-0000] (Defaults region/platform to PC)`,
        { code: 'asciidoc' }
      );
    }

    let username = args[0].replace('#', '-');
    let hashuser = args[0];

    let url = `https://ow-api.com/v1/stats/pc/us/${username}/complete`;
    let overbuffUSA = `https://www.overbuff.com/players/pc/${username}?mode=competitive`;

    //syntax command
    if (args[0] == 'help') {
      return message.channel.send(
        `${ConfigService.config.prefix}ow [user-0000] [region] [platform]\n${
          ConfigService.config.prefix
        }ow [user-0000] (Defaults region/platform to PC)`,
        { code: 'asciidoc' }
      );
    }
    if (args[0].includes('#')) {
      try {
        const request = await fetch(url);
        const body = await request.json();

        if (body.error) {
          errorEvent(body.error, message);
          return message.channel.stopTyping(true);
        }
        if (body.private) {
          message.channel.stopTyping(true);
          let lvl = body.prestige * 100 + body.level;
          const embed = {
            description: `OverBuff for: [${hashuser}](${overbuffUSA})`,
            url: `${overbuffUSA}`,
            color: 16744960,
            footer: {
              icon_url:
                'https://steamusercontent-a.akamaihd.net/ugc/767148359772513521/87347549402E0F321074CFE9DA98C24212AF3DD3/?interpolation=lanczos-none&output-format=jpeg&output-quality=95&fit=inside%7C637%3A358&composite-to=*,*%7C637%3A358&background-color=black',
              text: `Powered by OW-API.com.`
            },
            thumbnail: {
              url: `${body.levelIcon}`
            },
            author: {
              name: `${hashuser}'s Stats`,
              url: `${overbuffUSA}`,
              icon_url: `${body.icon}`
            },
            fields: [
              {
                name: 'Level',
                value: `${lvl}`,
                inline: true
              },
              {
                name: 'SR',
                value: `🔒`,
                inline: true
              },
              {
                name: 'Career Competitive K.D.',
                value: `🔒`,
                inline: true
              },
              {
                name: 'Career Win Percentage',
                value: `🔒`,
                inline: true
              }
            ]
          };

          return message.channel.send({ embed });
        } else {
          let lvl = body.prestige * 100 + body.level;
          let kd =
            body.competitiveStats.careerStats.allHeroes.combat.eliminations /
            body.competitiveStats.careerStats.allHeroes.combat.deaths;
          let rounder = parseFloat(kd);
          let roundedKD = Math.round(rounder * 100) / 100;
          let winPercent =
            (body.competitiveStats.careerStats.allHeroes.game.gamesWon /
              body.competitiveStats.careerStats.allHeroes.game.gamesPlayed) *
            100;

          const embed = {
            description: `OverBuff for: [${hashuser}](${overbuffUSA})`,
            url: `${overbuffUSA}`,
            color: 16744960,
            footer: {
              icon_url:
                'https://steamusercontent-a.akamaihd.net/ugc/767148359772513521/87347549402E0F321074CFE9DA98C24212AF3DD3/?interpolation=lanczos-none&output-format=jpeg&output-quality=95&fit=inside%7C637%3A358&composite-to=*,*%7C637%3A358&background-color=black',
              text: `Powered by OW-API.com.`
            },
            thumbnail: {
              url: `${body.ratingIcon}`
            },
            author: {
              name: `${hashuser}'s Stats`,
              url: `${overbuffUSA}`,
              icon_url: `${body.icon}`
            },
            fields: [
              {
                name: 'Level',
                value: `${lvl}`,
                inline: true
              },
              {
                name: 'SR',
                value: `${body.rating}`,
                inline: true
              },
              {
                name: 'Career Competitive K.D.',
                value: `${roundedKD}`,
                inline: true
              },
              {
                name: 'Career Win Percentage',
                value: `${winPercent}%`,
                inline: true
              }
            ]
          };

          message.channel.send({ embed });
          message.channel.stopTyping(true);
        }
      } catch (e) {
        return errorEvent('Could not reach OW Stats API', message);
      }
    } else {
      message.channel.send(
        `${ConfigService.config.prefix}ow [user-0000] [region] [platform]\n${
          ConfigService.config.prefix
        }ow [user-0000] (Defaults region/platform to PC)`,
        { code: 'asciidoc' }
      );
      return message.channel.stopTyping(true);
    }
  }
  cooldown(message, cmd);
};

exports.description = 'Grab simple Overwatch stats for a user.';
