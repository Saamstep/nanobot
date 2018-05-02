exports.run = (client, message, args) => {
  var request = require('request');

  var mcIP = args[0];
  var url = 'https://mcapi.us/server/status?ip=' + mcIP;
  request(url, function (err, response, body) {


    body = JSON.parse(body);
    var status = '\n**Server:** :x:';
    if (body.online) {
      status = '\n**Server:** :white_check_mark:';
      if (body.players.now) {
        status += '\n**Players:** ' + body.players.now;
      } else {
        status += '\n**Players:** 0';
      }
    }

    if (mcIP) {
      message.channel.send("\n**" + mcIP + "** " + status);
    } else {
      return message.reply("Provide an IP please.");
    }
  });

};
exports.description = 'Find the status of the server.'
