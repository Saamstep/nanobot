const ConfigService = require('../config.js');
const errorMod = require('../modules/errorMod');
const fetch = require('node-fetch');

exports.run = async (client, message, args) => {
  const cooldown = require('../index.js');
  async function cmd() {
    message.channel.startTyping(1);

    var mcIP = args[0] ? args[0] : `${ConfigService.config.mcIP}`; // Your MC server IP
    var statusURL = 'https://api.mcsrvstat.us/2/' + mcIP;
    try {
      const response = await fetch(statusURL);
      const stats = await response.json();
      if (args[0] === ConfigService.config.mcIP) {
        const embed = {
          url: 'https://discordapp.com',
          color: 10276707,
          timestamp: '2019-05-02T18:27:39.294Z',
          footer: {
            icon_url: 'https://cdn.discordapp.com/embed/avatars/0.png',
            text: 'Server Status'
          },
          thumbnail: {
            url: 'icon'
          },
          author: {
            name: 'Server Status',
            url: 'https://discordapp.com',
            icon_url: 'https://cdn.discordapp.com/embed/avatars/0.png'
          },
          fields: [
            {
              name: '',
              value: 'some of these properties have certain limits...'
            }
          ]
        };
        channel.send({ embed });
      } else {
        if (stats.online == true) {
          const embed = {
            url: 'https://discordapp.com',
            color: 10276707,
            timestamp: '2019-05-02T18:27:39.294Z',
            footer: {
              icon_url: 'https://cdn.discordapp.com/embed/avatars/0.png',
              text: 'Server Status'
            },
            thumbnail: {
              url: 'icon'
            },
            author: {
              name: 'Server Status',
              url: 'https://discordapp.com',
              icon_url: 'https://cdn.discordapp.com/embed/avatars/0.png'
            },
            fields: [
              {
                name: '',
                value: 'some of these properties have certain limits...'
              }
            ]
          };
          channel.send({ embed });
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
