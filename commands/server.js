const ConfigService = require('../config.js');

exports.run = (client, message, args) => {
  message.chanel.startTyping();
  var request = require('request');

  var mcIP = `${ConfigService.config.mcIP}`; // Your MC server IP
  var mcPort = `${ConfigService.config.mcPort}`; // Your MC server port
  var url = 'http://mcapi.us/server/status?ip=' + mcIP + '&port=' + mcPort;

  request(url, function (err, response, body) {
    if (err) {
      console.log(err);
      return message.chanel.send(':warning: Error getting Minecraft server status...');
    }
    body = JSON.parse(body);
    var status = '**' + ConfigService.config.serverName + '** is currently offline.';
    if (body.online) {
      status = ConfigService.config.serverName + ' is **online**';
      if (body.players.now) {
        status += '\n**' + body.players.now + '** persons are playing!';
      } else {
        status += '\n*Nobody is playing!*';
      }
    }
    message.channel.send(status);

  });

  message.channel.stopTyping();

};

exports.description = 'Get server status for said Minecraft server.'
