const config = require('../config.json');
var request = require('request');
var dateFormat = require('dateformat');
var now = new Date();

exports.run = (client, message, args) => {
  if (message.content === '$btc') {
    message.react('✅');
  }

  var url = 'https://api.coinbase.com/v2/prices/spot?currency=USD';

  request(url, function(err, response, body) {
    if (err) {
      return console.log(err);
    }
    body = JSON.parse(body);
    let day = dateFormat(now, '**mmmm dS, yyyy h:MM:ss TT**');
    message.channel.send(
      day +
        ' | ' +
        ':hash: Current value of the Bitcoin:' +
        ' **$' +
        body.data.amount +
        '**'
    );

    console.log(`${config.prefix}btc used`);
  });
};

exports.description = 'Find the current price of Bitcoin.';
