const errorMod = require('../modules/errorMod');
const fetch = require('node-fetch');

exports.run = async (client, message, args) => {
  const cooldown = require('../index.js');
  async function cmd() {
    let url = 'https://catfact.ninja/fact';
    message.channel.startTyping(1);

    try {
      const response = await fetch(url);
      const body = await response.json();
      message.channel.send(':cat: | ' + body.fact);
    } catch (e) {
      errorMod('Could not reach Cat Facts API', message);
    }

    message.channel.stopTyping(true);
  }
  cooldown(message, cmd);
};

exports.description = 'Get a random cat fact.';
