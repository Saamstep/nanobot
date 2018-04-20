exports.run = (client, message, args) => {
  const config = require('../config.json');
  const fs = require('fs');
  let msg = args.join(' ').replace(args[0], '');
  let newMsg = msg.replace(/\s/g, '');

  fs.writeFile(
    `./commands/cc/${args[0]}.js`,
    `exports.run = (client, message, args) => { message.channel.send(\`${newMsg}\`); };`
  );
  message.channel.send(`Changes made to: ${config.prefix}\`${args[0]}\``);
};
