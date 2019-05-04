const ConfigService = require('../config.js');
const errorMod = require('../modules/errorMod');
const fetch = require('node-fetch');

exports.run = async (client, message, args) => {
  const cooldown = require('../index.js');
  async function cmd() {
    message.channel.startTyping(1);

    var mcIP = args[0] ? args[0] : `${ConfigService.config.mcIP}`; // Your MC server IP
    var mcPort = ConfigService.config.mcPort;
    var statusURL = 'https://api.mcsrvstat.us/2/' + mcIP + ':' + mcPort;
    try {
      const response = await fetch(statusURL);
      const stats = await response.json();
      console.log(stats);
      if (args[0] === ConfigService.config.mcIP) {
        const embed = {
          url: 'https://mcsrvstat.us/',
          color: 10276707,
          timestamp: Date.now(),
          footer: {
            icon_url:
              'https://gamepedia.cursecdn.com/minecraft_gamepedia/0/01/Grass_Block_TextureUpdate.png',
            text: 'Server Status'
          },
          thumbnail: {
            url: stats.icon
          },
          author: {
            name: 'Server Status',
            url: 'https://mcsrvstat.us/',
            icon_url:
              'https://gamepedia.cursecdn.com/minecraft_gamepedia/0/01/Grass_Block_TextureUpdate.png'
          },
          fields: [
            {
              name: '',
              value: 'some of these properties have certain limits...'
            }
          ]
        };
        message.channel.send({ embed });
      } else {
        if (stats.online == true) {
          const embed = {
            url: 'https://mcsrvstat.us/',
            color: 10276707,
            timestamp: Date.now(),
            footer: {
              icon_url:
                'https://gamepedia.cursecdn.com/minecraft_gamepedia/0/01/Grass_Block_TextureUpdate.png',
              text: 'Server Status'
            },
            thumbnail: {
              url: stats.icon
            },
            author: {
              name: 'Server Status',
              url: 'https://discordapp.com',
              icon_url:
                'https://gamepedia.cursecdn.com/minecraft_gamepedia/0/01/Grass_Block_TextureUpdate.png'
            },
            fields: [
              {
                name: 'Online',
                value: stats.players.online + '/' + stats.players.max
              },
              {
                name: 'MOTD',
                value: stats.motd.clean.join(' ')
              }
            ]
          };
          message.channel.send({ embed });
        }
      }
    } catch (e) {
      console.log(e);
      return errorMod('Error getting Minecraft server status.', message);
    }
  }
  // cooldown(message, cmd);
  cmd();
};

exports.description = 'Get server status for said Minecraft server.';
