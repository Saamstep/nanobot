const config = require('../config.json');
const fetch = require('node-fetch');
const dateFormat = require('dateformat');

exports.run = async (client, message, args) => {

	const cooldown = require('../index.js');

	async function cmd() {
		const now = new Date();

		let url = 'https://api.coinbase.com/v2/prices/spot?currency=USD';

		const response = await fetch(url);

		if (!response.ok) {
			message.channel.send('Could not reach CoinBase');
			return;
		}

		const body = await response.json();
		const day = dateFormat(now, 'mmmm dS, yyyy h:MM:ss TT');
		message.channel.send('Coinbase says on ' +
      day +
      ' the current value of the Bitcoin is:' +
      ' **$' +
      body.data.amount +
      '**'
		);
	}

	cooldown(message, cmd);

};

exports.description = 'Find the current price of Bitcoin.';
