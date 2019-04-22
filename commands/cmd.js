exports.run = (client, message, args) => {
  const errorMod = require('../modules/errorMod.js');
  const cM = require('../modules/consoleMod.js');
  const log = require('../modules/logMod.js');
  const config = require('../config.json');
  const ConfigService = require('./config.js');
  var Rcon = require('rcon');
  var updatedport = Number(ConfigService.config.rconPort);
  var conn = new Rcon(
    `${ConfigService.config.mcIP}`,
    updatedport,
    `${ConfigService.config.rconPass}`
  );
  let cmd = args.join(' ');

  let isAdmin = require('../modules/isAdmin.js');
  if (isAdmin(message.author, message)) {
    try {
      conn
        .connect()
        .then(() => {
          conn.send(cmd);
          cM(`Command ${cmd} sent by ${message.author}`);
          log('RCON', `/${cmd}`, 16774912, message);
          message.channel.send('Command: `' + cmd + '` sent');
        })
        .then(() => {
          console.log('Disconnecting...');
          return conn.disconnect();
        });
    } catch {
      console.error(error);
    }
  }
};

exports.description =
  'Allows you to run MC Server commands using Remote Console';
