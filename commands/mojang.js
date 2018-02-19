const config = require('../config.json');
var request = require('request');

exports.run = (client, message, args) => {

var url = "https://status.mojang.com/check"

request(url, function(err, response, body) {
    if(err) {
      console.log(err);
      return message.reply('Error getting Mojang status.');
    }
    body = JSON.parse(body);
    
    var mcnet = body[0]['minecraft.net'];
    // console.log(body);
    // console.log(mcnet);

    var responseString = "";

    for (status in body) {
      var domain = Object.keys(body[status])[0]
      var connected = body[status][domain];
      // console.log(domain);
      // console.log(values);

      responseString += `\n**${domain}:** ${connected ? ':white_check_mark:\n' : ':x:\n'}`;

      
      
    }
    message.channel.send(responseString)

})
}
