const fetch = require('node-fetch');
const fs = require('fs');
exports.run = async (client, message, args) => {
  const cooldown = require('../index.js');
  async function cmd() {
    var mcIP = args[0]
      ? args[0]
      : `${client.ConfigService.config.minecraft.serverIP}:${client.ConfigService.config.minecraft.port}`; // Your MC server IP
    var statusURL = 'https://api.mcsrvstat.us/2/' + mcIP;
    try {
      const response = await fetch(statusURL);
      const stats = await response.json();

      // ALL OTHER SERVERS
      if (stats.online) {
        let icon = new Buffer.from(stats.icon.replace('data:image/png;base64,', ''), 'base64');
        let output = stats.hostname.replace('.', '-') + '.png';
        // fs.writeFileSync('../icons/' + output, icon);
        const embed = {
          url: 'https://mcsrvstat.us/',
          color: 10276707,
          timestamp: Date.now(),
          footer: {
            icon_url: client.user.avatarURL,
            text: 'Server Status'
          },
          thumbnail: {
            url: 'attachment://../icons/' + output
          },
          author: {
            name: args[0],
            url: 'https://mcsrvstat.us/',
            icon_url: 'https://gamepedia.cursecdn.com/minecraft_gamepedia/0/01/Grass_Block_TextureUpdate.png'
          },
          fields: [
            {
              name: 'Online',
              value: stats.players.online + '/' + stats.players.max
            },
            {
              name: 'MOTD',
              value: stats.motd.clean.join(' ')
            },
            {
              name: 'Version',
              value: stats.version
            }
          ]
        };
        message.channel.send({ embed });
      } else {
        message.channel.send('Not online');
      }
    } catch (e) {
      console.log(e);
      return client.error('Error getting Minecraft server status.', message);
    }
  }
  // cooldown(message, cmd);
  message.channel.send('Getting status for server');
  cmd();
};

exports.description = 'Get server status for said Minecraft server.';
