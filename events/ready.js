exports.run = (client, member, message) => {
  var config = require('../config.json');
  var colors = require('colors');
  var request = require('request');
  const guildNames = client.guilds.map(g => g.name).join('\n');
  let bar = '+===========================================+';

  client.user
    .setPresence({ game: { name: `${config.defaultGame}`, type: 0 } })
    .catch(console.error);

  var url = 'https://srhpyqt94yxb.statuspage.io/api/v2/status.json';

  request(url, function(err, response, body) {
    if (err) {
      console.log(err);
      return message.reply('Error getting Mojang status.');
    }
    body = JSON.parse(body);
    var indicator = body.status.indicator;
    var desc = body.status.description;

    if (body.status.description == 'All Systems Operational') {
      console.log(bar.yellow);
      console.log('[Discord Status] All Systems Operational\n'.green);
    } else {
      console.log(bar.yellow);
      console.log(
        '[Discord Status] There seems to be an error within Discord. Double check http://www.status.discordapp.com/ \n'
          .red
      );
    }
  });

  setTimeout(() => {
    console.log(
      `${config.serverName}`.underline.cyan +
        ' bot is online!\n'.cyan +
        `\nConnected to:`.cyan +
        `\n${guildNames}`.italic.cyan
    );
    console.log(
      '\n[IMPORTANT] KEEP THIS WINDOW OPEN FOR BOT TO STAY ONLINE'.bold.red
    );
    console.log(bar.yellow);
    console.log(
      '\nErrors will appear if you have debug mode enabled. Specific console log events will appear below as well.\n'
        .italic.green
    );
  }, 500);
};
