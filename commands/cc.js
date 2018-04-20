exports.run = (client, message, args) => {
  const config = require('../config.json');
  const fs = require('fs');
  let msg = args.join(' ').replace(args[1], '');
  let newMsg = msg.replace(/\s/, '');

  if (args[0] === 'add') {
    fs.writeFile(
      `./commands/cc/${args[1]}.js`,
      `exports.run = (client, message, args) => { const config = require('../../config.json'); message.channel.send(\`${newMsg}\`); };`
    );
    message.channel.send(`Changes made to: \`${config.prefix}${args[0]}\``);
  }

  if (args[0] === 'del') {
    fs.unlink(`./commands/cc/${args[1]}.js`);
    message.channel.send(`Deleted \`${config.prefix}${args[0]}\``);
  }
};
