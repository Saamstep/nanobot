const ConfigService = require('../config.js');
const errorMod = require('../modules/errorMod');
const fetch = require('node-fetch');

exports.run = async (client, message, args) => {
  message.channel.startTyping();

  var mcIP = args[0] ? args[0] : `${ConfigService.config.mcIP}`; // Your MC server IP
  var mcPort = args[1] ? args[1] : `${ConfigService.config.mcPort}`; // Your MC server port
  var url = 'http://mcapi.us/server/status?ip=' + mcIP + '&port=' + mcPort;

  try {
    const response = await fetch(url);
    const body = await response.json();

    var status = '**' + (args[0] ? args[0] : ConfigService.config.serverName) + '** is currently offline.';
    if (body.online) {
      status = (args[0] ? args[0] : ConfigService.config.serverName) + ' is **online**';
      if (body.players.now) {
        status += '\n**' + body.players.now.toLocaleString() + '** persons are playing!';
      } else {
        status += '\n*Nobody is playing!*';
      }
    }
    message.channel.send(status);

    message.channel.stopTyping(true);
  } catch(e) {
    return errorMod('Error getting Minecraft server status...', message);
  }
};

exports.description = 'Get server status for said Minecraft server.';
