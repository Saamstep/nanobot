exports.run = (client, message, args) => {

  const isOwner = require('../modules/isOwner.js');
  




  if (isOwner(message)) {
    message.channel.send('Pinging...').then(sent => {
      sent.edit(
        `Pong! Response time: ${sent.createdTimestamp -
        message.createdTimestamp}ms`
      );
    });
  }
};
exports.description = 'Pings the bot.';
