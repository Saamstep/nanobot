const ConfigService = require('../config.js');
var request = require('request');
var errorEvent = require('../modules/errorMod.js');

exports.run = (client, message, args) => {
  message.channel.startTyping();
  var url = 'https://srhpyqt94yxb.statuspage.io/api/v2/status.json';

  request(url, function (err, response, body) {
    if (err) {
      // console.log(err);
      return errorEvent('Could not fetch Discord status', message);
    }
    body = JSON.parse(body);
    var indicator = body.status.indicator;
    var desc = body.status.description;

    if (body.status.description == 'All Systems Operational') {
      message.channel.send(
        'Status: **' + ':white_check_mark: All Systems Operational**'
      );
    } else {
      message.channel.send(
        'Indicator: **' + indicator + '**\n' + 'Message: **' + desc + '**'
      );
    }
  });
  message.channel.stopTyping();
};


exports.description = 'Checks Discord status.'
