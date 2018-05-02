exports.run = (client, message, args) => {
  const error = require('../modules/errorMod.js');
  const config = require('../config.json');
  const fs = require('fs');
  let msg = args.join(' ').replace(args[0], '');
  let newMsg = msg.replace(/\s/, '');
  let newerMsg = newMsg.replace(args[1], '');

  if (args[0] === 'add') {
    fs.writeFile(
      `./commands/cc/${args[1]}.js`,
      `exports.run = (client, message, args) => { const config = require('../../config.json'); message.channel.send(\`${newerMsg}\`); };`
    );
    message.channel.send(`Changes made to: \`${config.prefix}${args[1]}\``);
    delete require.cache[require.resolve(`./commands/cc/${args[1]}.js`)];
  }

  if (args[0] === 'del') {
    if (fs.existsSync(`./commands/cc/${args[1]}.js`)) {
      fs.unlink(`./commands/cc/${args[1]}.js`);
      message.channel.send(`Deleted \`${config.prefix}${args[1]}\``);
      process.on('exit', function () {
        require('child_process').spawn(process.argv.shift(), process.argv, {
          cwd: process.cwd(),
          detached: true,
          stdio: 'inherit'
        });
      });
      process.exit();
    } else {
      return error(
        `Command \`${config.prefix}${args[1]}\` does not exist!`,
        message
      );
    }
  }

  if (!args[0]) {
    message.channel.send(
      `${
      config.prefix
      }cc [add | OR | del] [commandname] [text if adding command]`,
      { code: 'asciidoc' }
    );
  }
};

exports.description = 'Allows admins to add/remove custom commands.'
