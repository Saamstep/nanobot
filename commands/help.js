// hi
exports.run = (client, message, args) => {
  const config = require('../config.json');
  let command = message.content.split(' ')[0];
  command = command.slice(config.prefix.length);

  const testFolder = './commands/';
  const fs = require('fs');
  var path = '../NanoBot/commands.txt'

  // fs.unlinkSync(path, function (err) {
  //   if (err) throw err;
  // });

  fs.readdir(testFolder, (err, files) => {
    files.forEach(file => {
      let cmdfiles = require(`../commands/${file}`);
      const config = require('../config.json');
      if (file === "cc") {
        fs.appendFile('commands.txt', '')
      } else {
        fs.appendFile('commands.txt', `${config.prefix}` + file.toString().replace('.js', ` - ${cmdfiles.description}\n`, function (err) {
          if (err) return;
        }));
      }

      // let parsedData = + `?` + file.toString().replace('.js', ` - ${cmdfiles.description}\n`);




    });

  });
  message.channel.send(JSON.parse(fs.readFileSync('NanoBot/commands.txt', 'utf8')));
};

exports.description = 'Shows all commands.'