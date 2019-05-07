const ConfigService = require('../config.js');
const errorMod = require('../modules/errorMod');
const fetch = require('node-fetch');
const fs = require('fs');
const logger = require('../modules/consoleMod.js');
const colors = require('colors');

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

      // image decoder
      // let serverIcon = new Buffer.from(
      //   stats.icon.split(';base64').pop(),
      //   'base64'
      // );
      // let icon = mcIP.replace('.', '-') + '.png';
      // if (fs.existsSync(icon)) {
      //   fs.unlink(icon, err => {
      //     if (err) logger('Could not delete '.red + icon.red.bold + '\n' + err);
      //   });
      // }
      // fs.writeFile(icon, serverIcon, err => {
      //   if (err) {
      //     logger(
      //       'Server Stats | Server Icon could not be created.\n'.red + err
      //     );
      //   }
      // });

      //playerlist
      let playerList = '';
      if (!stats.players.list) {
        playerList = 'N/A';
      } else if (!stats.players.list.length > 0) {
        playerList = 'Nobody is playing.';
      } else if (stats.players.list.length > 0) {
        playerList = stats.players.list.join('\n');
      }

      if (args[0] === ConfigService.config.mcIP || !args[0]) {
        // MC SMP COMMAND STATS
        const embed = {
          url: 'https://mcsrvstat.us/',
          color: 10276707,
          timestamp: Date.now(),
          footer: {
            icon_url: client.user.avatarURL,
            text: 'Server Status'
          },
          // thumbnail: {
          //   url: 'attachment://mc-samstep.ga.png'
          // },
          author: {
            name: ConfigService.config.serverName + ' SMP',
            url: 'https://mcsrvstat.us/',
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
            },
            {
              name: 'Players',
              value: playerList
            }
          ]
        };
        message.channel.send({ embed });
      } else {
        // ALL OTHER SERVERS
        if (stats.online == true) {
          const embed = {
            url: 'https://mcsrvstat.us/',
            color: 10276707,
            timestamp: Date.now(),
            footer: {
              icon_url: client.user.avatarURL,
              text: 'Server Status'
            },
            // thumbnail: {
            //   url: icon
            // },
            author: {
              name: args[0],
              url: 'https://mcsrvstat.us/',
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
              },
              {
                name: 'Players',
                value: playerList
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
