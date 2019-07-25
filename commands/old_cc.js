exports.run = (client, message, args, cc) => {
  const error = require('../modules/errorMod.js');
  const ConfigService = require('../config.js');
  const fs = require('fs');
  const msg = args.join(' ').replace(args[0], '');
  const newMsg = msg.replace(/\s/, '');
  const newerMsg = newMsg.replace(args[1], '');

  const isAdmin = require('../modules/isAdmin.js');
  if (isAdmin(message.author, message)) {
    if (args[0] === 'add') {
      fs.writeFile(
        `./commands/cc/${args[1]}.js`,
        `exports.run = (client, message, args) => { const ConfigService = require('../../config.js'); let guild = message.guild; message.channel.send(\`${newerMsg}\`); };`,
        function(err) {
          if (err) throw err;
        }
      );
      message.channel.send(`Changes made to: \`${ConfigService.config.prefix}${args[1]}\``);
      delete require.cache[require.resolve(`./commands/cc/${args[1]}.js`)];
    }

    if (args[0] === 'del') {
      if (fs.existsSync(`./commands/cc/${args[1]}.js`)) {
        fs.unlink(`./commands/cc/${args[1]}.js`, err => {
          if (err) throw err;
          message.channel.send(`Deleted \`${ConfigService.config.prefix}${args[1]}\``);
        });
      } else {
        return error(`Command \`${ConfigService.config.prefix}${args[1]}\` does not exist!`, message);
      }
    }

    if (!args[0]) {
      message.channel.send(`${ConfigService.config.prefix}cc [add | OR | del] [commandname] [text if adding command]`, {
        code: 'asciidoc'
      });
    }
  }
};

exports.description = 'Allows admins to add/remove custom commands.';
