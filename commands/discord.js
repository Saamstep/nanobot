const config = require('../config.json');
var request = require('request');

exports.run = (client, message, args) => {

var url = "https://srhpyqt94yxb.statuspage.io/api/v2/status.json"

request(url, function(err, response, body) {
    if(err) {
      console.log(err);
      return message.reply('Error getting Mojang status.');
    }
    body = JSON.parse(body);
    var indicator = body.status.indicator
    var desc = body.status.description

    if (body.status.description == "All Systems Operational")
    {
      message.channel.send("Status: **" + ":white_check_mark: All Systems Operational**");
    } else {
    message.channel.send("Indicator: **" + indicator + "**\n" + "Message: **" + desc + "**");
  }

})


}

