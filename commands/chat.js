const ConfigService = require('../config.js');
const errorMod = require('../modules/errorMod.js');
const fetch = require('node-fetch');

exports.run = async (client, message, args) => {
  if (!args) {
    return message.channel.send('Say something!');
  }
  let msg = args.join(' ');
  try {
    message.channel.startTyping();
    const response = await fetch(`https://some-random-api.ml/chatbot/?message=${msg}`);
    const reply = await response.json();
    message.channel.send(reply.response);
  } catch (e) {
    console.error(e);
  }
};

exports.cmd = {
  enabled: true,
  category: 'Fun',
  level: 0,
  description: 'Have a conversation with the bot!'
};
