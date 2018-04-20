// hi
exports.run = (client, message, args) => {
  // const config = require('../config.json');
  // let command = message.content.split(' ')[0];
  // command = command.slice(config.prefix.length);

  const testFolder = './commands/';
  const fs = require('fs');
  const config = require('../config.json');

  fs.readdir(testFolder, (err, files) => {
    files.forEach(file => {
      let otherfile = require(`../commands/${file}`);
      // let desc = otherfile.description;
      // console.log(otherfile + '||' + description);
      // function parsedData() {
      // let parsedData =
      //   `${config.prefix}` +
      //   file.toString().replace('.js', ` - ${accept.description}`);
      // message.channel.send(`${parsedData}`);
      // }
    });
  });
  // parsedData();
  // message.channel.send(`${file.join('\n')}`, { code: 'asciidoc' });
  var description = require('../commands/accept.js');

  console.log(JSON.stringify(description));
};
