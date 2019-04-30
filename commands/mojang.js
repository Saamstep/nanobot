const ConfigService = require('../config.js');
var fetch = require('node-fetch');

exports.run = async (client, message, args) => {
  const cooldown = require('../index.js');
  async function cmd() {
    message.channel.startTyping(1);

    try {
      const request = await fetch('https://status.mojang.com/check');
      const body = await request.json();

      var responseString = '';

      for (status in body) {
        var domain = Object.keys(body[status])[0];
        var connected = body[status][domain];

        responseString += `**${domain}:** ${
          connected ? ':white_check_mark:\n' : ':x:\n'
        }`;
      }
      message.channel.send(responseString);
      message.channel.stopTyping(true);
    } catch (e) {
      return errorMod('Error getting Mojang status', message);
    }
  }
  cooldown(message, cmd);
};

exports.description = 'Gets Mojang server status.';
