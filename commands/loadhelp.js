const config = require('../config.json');
const errorMod = require('../modules/errorMod.js');
const testFolder = './commands/';
const ccFolder = './commands/cc/';
const fs = require('fs');
var path = '../NanoBot/commands.txt';
exports.run = (client, message, args) => {
  let adminRole = message.guild.roles.find('name', `${config.adminrolename}`);

  if (message.member.roles.has(adminRole.id)) {
    fs.readdir(testFolder, (err, zfiles) => {
      zfiles.forEach(afile => {
        let cmdfiles = require(`../commands/${afile}`);
        const config = require('../config.json');
        if (afile === 'cc') {
          fs.appendFile('commands.txt', '');
        }
      });
    });

    fs.readdir(ccFolder, (err, files) => {
      files.forEach(file => {
        let cmdfiles = require(`../commands/cc/${file}`);
        const config = require('../config.json');
        fs.appendFile(
          'commands.txt',
          `${config.prefix}` +
            file.toString().replace('.js', `\n`, function(err) {
              if (err) return;
            })
        );
      });
    });
  } else {
    errorMod('You do not have the right permissions!', message);
  }
};

exports.description = 'Allows admins to refresh the help command.';
