exports.run = (client, message, args) => {
  // const request = require('request');

  // message.channel.startTyping();

  // // START
  // var platform = args[0];
  // var epicID = args[1];

  // let options = {
  //   url: `https://api.fortnitetracker.com/v1/profile/${platform}/${epicID}`,
  //   method: 'GET',
  //   headers: {
  //     'User-Agent': 'D.js-Bot-Dev',
  //     'TRN-Api-Key': `${config.trn_api_key}`
  //   }
  // };

  // request(options, function(error, response, body) {
  //   const error = require('../modules/errorMod.js');
  //   try {
  //     body = JSON.parse(body);

  //     if (body.error) {
  //       error(body.error, message);
  //       return message.channel.stopTyping(true);
  //     }
  //     message.channel.send(
  //       '**Username**' +
  //         body.epicUserHandle +
  //         '\n\n**Score**' +
  //         body.p9[0].stats.lifeTimeStats.key.Score
  //     );
  //   } catch {
  //     error(
  //       'Either there was a fatal error or there were invalid paramaters.',
  //       message
  //     );
  //     return message.channel.stopTyping(true);
  //   }

  //   if (error) {
  //     return console.log(error);
  //   }
  // });
  // message.channel.stopTyping(true);

  message.reply(';)');
};

exports.description = 'Un-functional Fortnite command.';
