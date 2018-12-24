const errorMod = require('../modules/errorMod');
const fetch = require('node-fetch');

exports.run = async (client, message, args) => {
  let url = 'https://catfact.ninja/fact';
  message.channel.startTyping();

  try {
    const response = await fetch(url);
    const body = await response.json();
    message.channel.send(':cat: | ' + body.fact);
  } catch(e) {
    errorMod('Could not reach Cat Facts API', message);
  }

  message.channel.stopTyping(true);
};

exports.description = 'Get a random cat fact.';
