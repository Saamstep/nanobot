const config = require('../config.json');

exports.run = (client, message, args) => {
  var request = require('request');

  var mcIP = `${config.mcIP}`; // Your MC server IP
  var mcPort = `${config.mcPort}`; // Your MC server port
  var url = 'http://mcapi.us/server/status?ip=' + mcIP + '&port=' + mcPort;

  request(url, function (err, response, body) {
    if (err) {
      console.log(err);
      return message.chanel.send(':warning: Error getting Minecraft server status...');
    }
    body = JSON.parse(body);
    var status = '**' + config.serverName + '** is currently offline.';
    if (body.online) {
      status = config.serverName + ' is **online**';
      if (body.players.now) {
        status += '\n**' + body.players.now + '** persons are playing!';
      } else {
        status += '\n*Nobody is playing!*';
      }
    }
    message.channel.send(status);
  });

  // exports.conf = {
  //   enabled: true,
  //   guildOnly: false,
  //   aliases: ['check'],
  //   permLevel: 0
  // };

  // exports.help = {
  //   name: 'server',
  //   description: 'Checks status of the server',
  //   usage: 'server'
  // };


};

exports.description = 'Get server status for said Minecraft server.'
