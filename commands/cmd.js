exports.run = (client, message, args, conn) => {
  const errorMod = require('../modules/errorMod.js');
  const cM = require('../modules/consoleMod.js');
  const log = require('../modules/logMod.js');
  const config = require('../config.json');
  const ConfigService = require('../config.js');

  let cmd = args.join(' ');

  let isAdmin = require('../modules/isAdmin.js');
  if (isAdmin(message.author, message)) {
    conn.send(cmd);
  }

  conn.on('response', function(str) {
    if (str) {
      message.channel.send(str);
    }
  });
};

exports.description =
  'Allows you to run MC Server commands using Remote Console';
