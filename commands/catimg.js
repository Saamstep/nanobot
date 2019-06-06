const ConfigService = require('../config.js');
const errorMod = require('../modules/errorMod.js');
const fetch = require('node-fetch');

exports.run = async (client, message, args) => {
  message.channel.startTyping(1);
  try {
    const response = await fetch('https://api.thecatapi.com/v1/images/search', {
      headers: {
        'x-api-key': `${client.ConfigService.config.apis.cat}`
      }
    });
    const body = await response.json();
    message.channel.send(' ', { file: body[0].url });
  } catch (e) {
    client.error('Could not reach Cat API, contact the bot owner', message);
  }
  message.channel.stopTyping(true);
};

exports.description = 'Get a random cat image.';
