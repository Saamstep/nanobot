exports.run = (client, message, args) => {
  var request = require('request');

  var mcIP = args[0];
  var url = 'https://mcapi.us/server/status?ip=' + mcIP;
  request(url, function(err, response, body) {

    if(err) {
      console.log(err);
      return message.reply('There was an error getting the Minecraft server status.');
    }
    body = JSON.parse(body);
    var status = 'The server is currently offline';
    if(body.online) {
      status = 'The server is **online**  -  ';
      if(body.players.now) {
        status += '**' + body.players.now + '** persons are playing!';
      } else {
        status += '*Nobody is playing!*';
      } 
    }
    message.reply(status + " Direct URL: " + url);
  });

};
