const ConfigService = require('../config.js');
const errorMod = require('../modules/errorMod.js');
const fetch = require('node-fetch');
const cooldown = require('../index.js');

exports.run = async (client, message, args) => {
  async function cmd() {
    try {
      message.channel.startTyping();
      const response = await fetch('https://some-random-api.ml/meme');
      const body = await response.json();

      const embed = {
        title: body.text,
        image: {
          url: body.url
        }
      };
      message.channel.send({ embed });
    } catch (e) {
      console.error(e);
    }
  }
  cooldown(message, cmd);
};
