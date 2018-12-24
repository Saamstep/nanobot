const ConfigService = require('../config.js');
const errorMod = require('../modules/errorMod.js');
const fetch = require('node-fetch');

exports.run = async (client, message, args) => {
  message.channel.startTyping();
  try {
    const response = await fetch('https://api.thedogapi.com/v1/images/search', {
      headers: {
        'x-api-key': `${ConfigService.config.catAPI}`
      }
    });
    const body = await response.json();
    message.channel.send(' ', { file: body[0].url });
  } catch(e) {
    errorMod('Could not reach Dog API, contact the bot owner', message);
  }
  message.channel.stopTyping(true);
};

exports.description = 'Get a random dog image.';
