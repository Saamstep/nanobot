const config = require('../config.json');

exports.run = (client, message, args) => {
  var request = require('request');

  var mcIP = `${config.mcIP}`; // Your MC server IP
  var mcPort = `${config.mcPort}`; // Your MC server port
  var url = 'http://mcapi.us/server/status?ip=' + mcIP + '&port=' + mcPort;

  request(url, function(err, response, body) {
    if(err) {
      console.log(err);
      return message.reply('Error getting Minecraft server status...');
    }
    body = JSON.parse(body);
    var status = '**' + serverName + '** is currently offline.';
    if(body.online) {
      status = '**NanoSMP** server is **online**  -  ';
      if(body.players.now) {
        status += '**' + body.players.now + '** persons are playing!';
      } else {
        status += '*Nobody is playing!*';
      }
    }
    message.reply(status);
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
