const config = require('../config.json');
exports.run = (client, member, message) => {
  var colors = require('colors');
  var request = require('request');
  const guildNames = client.guilds.map(g => g.name).join('\n');
  let bar = '+===========================================+';
  const errorMod = require('../modules/errorMod.js');
  const testFolder = './commands/';
  const ccFolder = './commands/cc/';
  const fs = require('fs');
  var path = '../NanoBot/commands.txt';


  client.user
    .setPresence({ game: { name: `${config.defaultGame}`, type: 0 } })
    .catch(console.error);

  var url = 'https://srhpyqt94yxb.statuspage.io/api/v2/status.json/';

  // DISCORD_STATUS_REQUEST

  request(url, function (err, response, body) {
    if (err) {
      return console.log(
        'Error: DISCORD_STATUS_REQUEST. Please tell the bot author.'.red.bold
      );
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
        '[Discord Status] There seems to be an error within Discord. Double check https://status.discordapp.com/ \n'
          .red
      );
    }
  });

  if (fs.existsSync('./commands.txt')) {
    fs.unlinkSync('./commands.txt');
  }


  async function RD() {

    await fs.readdir(testFolder, (err, files) => {
      console.log('Updating help file...'.red);
      files.forEach(file => {
        if (file === 'cc') {
          return;
        }
        if (file.startsWith('.')) {
          return;
        }
        else {
          let cmdfiles = require(`../commands/${file}`);
          const config = require('../config.json');
          fs.appendFile('commands.txt', `${config.prefix}` + file.toString().replace('.js', ` - ${cmdfiles.description}\n`), function (err, written, buffer) {
            if (err) { return; }
          });
        }
      });
    });

    await fs.readdir(ccFolder, (err, files) => {
      console.log('Updating help file...'.red);
      files.forEach(file => {
        if (file.startsWith('.')) {
          return;
        }
        else {
          let cmdfiles = require(`../commands/cc/${file}`);
          const config = require('../config.json');

          fs.appendFile('commands.txt', `${config.prefix}` + file.toString().replace('.js', ` - [Custom Command]\n`), function (err, written, buffer) {
            if (err) { return; }
          });
        }
      });
    });

  }

  RD();


  // DISCORD_T-O_FUNCTION

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

    if (config.debug === 'on') {
      console.log(
        '\nErrors will appear below.\n'
          .italic.green
      );
    }
  }, 500);

  // if (fs.existsSync('./commands.txt')) {
  //   fs.unlinkSync('./commands.txt');
  // }
  // fs.readdir(ccFolder, (err, files) => {
  //   files.forEach(file => {
  //     let cmdfiles = require(`../commands/cc/${file}`);
  //     const config = require('../config.json');
  //     fs.appendFile(
  //       'commands.txt',
  //       `${config.prefix}` +
  //       file.toString().replace('.js', `\n`, function (err) {
  //         if (err) return;
  //       })
  //     );
  //   });
  // });

};
