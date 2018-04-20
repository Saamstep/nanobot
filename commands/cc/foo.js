exports.run = (client, message, args) => {
  const config = require('../../config.json');
  message.channel.send(`👋 ${config.prefix}`);
};
