exports.run = (client, message, args) => {
  var request = require('request');

  var mcIP = '167.114.208.237'; // Your MC server IP
  var mcPort = `25560`; // Your MC server port
  var url = 'http://mcapi.us/server/status?ip=' + mcIP + '&port=' + mcPort;
  request(url, function(err, response, body) {
    if(err) {
      console.log(err);
      return message.reply('Error getting Minecraft server status...');
    }
    body = JSON.parse(body);
    var status = '**NanoSMP** is currently offline.';
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

};
