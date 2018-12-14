exports.run = (client, message, args) => {
  const ConfigService = require('../config.js');
  const config = require('../config.json');
  var request = require('request');
  let options = {
    method: 'GET',
    url: 'https://api.thedogapi.com/v1/images/search',
    headers: {
      'x-api-key': `${ConfigService.config.catAPI}`
    }
  };
  message.channel.startTyping();
  request(options, function(err, response, body) {
    try {
      body = JSON.parse(body);
      message.channel.send(' ', { file: body[0].url });
      message.channel.stopTyping(true);
    } catch {
      return console.error(err);
    }
  });
};
exports.description = 'Get a random dog image.';
