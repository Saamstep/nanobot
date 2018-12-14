exports.run = (client, message, args) => {
  var request = require('request');
  let url = 'https://catfact.ninja/fact';
  message.channel.startTyping();
  request(url, function(err, response, body) {
    try {
      body = JSON.parse(body);
      message.channel.send(':cat: | ' + body.fact);
    } catch {
      return message.channel.stopTyping();
    }
  });
  message.channel.stopTyping();
};
exports.description = 'Get a random cat fact.';
