// hi
exports.run = (client, message, args) => {
  const config = require('../config.json');
  let command = message.content.split(' ')[0];
  command = command.slice(config.prefix.length);
  const error = require('../modules/errorMod.js');

  const testFolder = './commands/';
  const ccFolder = './commands/cc/';
  const fs = require('fs');
  var path = '../NanoBot/commands.txt';
  let option = args[1];

  // fs.unlinkSync(path, function (err) {
  //   if (err) throw err;
  // });

  // if (option == 'options') {
  //   message.channel.send(`${config.prefix}help load\n${config.prefix}help`, {
  //     code: 'asciidoc'
  //   });
  // }
  // let adminRole = message.guild.roles.find('name', `${config.adminrolename}`);

  // if (option == 'load' && message.member.roles.has(adminRole.id)) {
  //   fs.readdir(testFolder, (err, files) => {
  //     files.forEach(file => {
  //       let cmdfiles = require(`../commands/${file}`);
  //       const config = require('../config.json');
  //       if (file === 'cc') {
  //         fs.appendFile('commands.txt', '');
  //       } else {
  //         fs.appendFile(
  //           'commands.txt',
  //           `${config.prefix}` +
  //             file
  //               .toString()
  //               .replace('.js', ` - ${cmdfiles.description}\n`, function(err) {
  //                 if (err) return;
  //               })
  //         );
  //       }
  //     });
  //   });

  //   fs.readdir(ccFolder, (err, files) => {
  //     files.forEach(file => {
  //       let cmdfiles = require(`../commands/cc/${file}`);
  //       const config = require('../config.json');
  //       fs.appendFile(
  //         'commands.txt',
  //         `${config.prefix}` +
  //           file.toString().replace('.js', `\n`, function(err) {
  //             if (err) return;
  //           })
  //       );
  //     });
  //   });
  // } else {
  var msg = fs.readFileSync('./commands.txt', 'utf8');
  return message.channel.send('Bot Commands:\n\n' + msg, {
    code: 'asciidoc'
  });
  // }

};

exports.description = 'Shows all commands.';
