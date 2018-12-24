const config = require('../config.json');
const fetch = require('node-fetch');
const dateFormat = require('dateformat');

exports.run = async (client, message, args) => {
  if (message.content === '$btc') {
    message.react('✅');
  }

  const now = new Date();

  var url = 'https://api.coinbase.com/v2/prices/spot?currency=USD';

  const response = await fetch(url);

  if (!response.ok) {
    message.channel.send('Could not reach CoinBase');
    return;
  }

  const body = await response.json();
  let day = dateFormat(now, '**mmmm dS, yyyy h:MM:ss TT**');
  message.channel.send(
    day +
      ' | ' +
      ':hash: Current value of the Bitcoin:' +
      ' **$' +
      body.data.amount +
      '**'
  );
};

exports.description = 'Find the current price of Bitcoin.';
