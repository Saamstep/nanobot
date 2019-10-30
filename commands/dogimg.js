const ConfigService = require('../config.js');
const errorMod = require('../modules/errorMod.js');
const fetch = require('node-fetch');

exports.run = async (client, message, args) => {
  const cooldown = require('../index.js');

  async function cmd() {
    message.channel.startTyping(1);
    try {
      const response = await fetch('https://api.thedogapi.com/v1/images/search', {
        headers: {
          'x-api-key': `${ConfigService.config.catAPI}`
        }
      });
      const body = await response.json();
      message.channel.send(' ', { file: body[0].url });
    } catch (e) {
      errorMod('Could not reach Dog API, contact the bot owner', message);
    }
    message.channel.stopTyping(true);
  }
  cooldown(message, cmd);
};

exports.cmd = {
  enabled: true,
  category: 'Fun',
  level: 0,
  description: 'Get a dog image'
};
