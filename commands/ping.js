exports.run = (client, message, args) => {
  // if (message.author.id !== '136637808063414272') {
  //   return message.reply("You do not have access to this command!");
  //  msg.channel.send("Ping?").then(m => m.edit(`Pong! Latency is ${m.createdTimestamp - msg.createdTimestamp}ms. API Latency is ${Math.round(bot.ping)}ms`) );
  // } else {
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
