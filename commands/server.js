const ConfigService = require('../config.js');
const errorMod = require('../modules/errorMod');
const fetch = require('node-fetch');

exports.run = async (client, message, args) => {
  const cooldown = require('../index.js');
  async function cmd() {
    message.channel.startTyping();

    var mcIP = args[0] ? args[0] : `${ConfigService.config.mcIP}`; // Your MC server IP
    var queryPort = args[1] ? args[1] : `${ConfigService.config.queryPort}`; // Your MC server port
    var mcPort = args[1] ? args[1] : `${ConfigService.config.mcPort}`; // Your MC server port
    var Queryurl =
      'http://mcapi.us/server/query?ip=' + mcIP + '&port=' + queryPort;
    var Staturl =
      'http://mcapi.us/server/image?ip=' +
      mcIP +
      '&port=' +
      mcPort +
      `&theme=dark&title=${ConfigService.config.serverName}`;

    try {
      const response = await fetch(Queryurl);
      const body = await response.json();

      if (body.online == false) {
        if (mcIP == ConfigService.config.mcIP) {
          const embed = {
            color: 12118406,
            image: {
              url:
                'https://mcapi.us/server/image?ip=' +
                mcIP +
                '&port=' +
                mcPort +
                '&theme=dark&title=' +
                ConfigService.config.serverName.replace(' ', '%20')
            }
          };
          message.channel.send({ embed });
        } else {
          const embed = {
            color: 12118406,
            image: {
              url: 'https://mcapi.us/server/image?ip=' + args[0] + '&theme=dark'
            }
          };
          message.channel.send({ embed });
        }
      }
      if (body.online == true) {
        console.log(body);
      }

      message.channel.stopTyping(true);
    } catch (e) {
      console.log(e);
      return errorMod('Error getting Minecraft server status...', message);
    }
  }
  // cooldown(message, cmd);
  cmd();
};

exports.description = 'Get server status for said Minecraft server.';
