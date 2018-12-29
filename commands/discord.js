const ConfigService = require('../config.js');
var errorMod = require('../modules/errorMod.js');
const fetch = require('node-fetch');

exports.run = async (client, message, args) => {

  async function cmd() {
    message.channel.startTyping();
    var url = 'https://srhpyqt94yxb.statuspage.io/api/v2/status.json';

    try {
      const response = await fetch(url);
      const body = await response.json();
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
    } catch (e) {
      return errorMod('Could not fetch Discord status', message);
    }

    message.channel.stopTyping(true);
  }


  cooldown(message, cmd);
};


exports.description = 'Checks Discord status.'
