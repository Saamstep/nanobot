exports.run = (client, message, args) => {
  const errorMod = require('../modules/errorMod.js');
  const cM = require('../modules/consoleMod.js');
  const log = require('../modules/logMod.js');
  const config = require('../config.json');
  let updatedport = Number(config.rconPort);
  const Rcon = require('modern-rcon');
  const rcon = new Rcon(`${config.mcIP}`, (port = updatedport), 'itsz3nder');
  let cmd = args.join(' ');

  let isAdmin = require('../modules/isAdmin.js');
  if (isAdmin(message.author, message)) {
    try {
      rcon
        .connect()
        .then(() => {
          rcon.send(cmd);
          cM(`Command ${cmd} sent by ${message.author}`);
          log('RCON', `/${cmd}`, 16774912, message);
          message.channel.send('Command: `' + cmd + '` sent');
        })
        .then(() => {
          return rcon.disconnect();
        });
    } catch {
      console.error(error);
    }
  }
};

exports.description =
  'Allows you to run MC Server commands using Remote Console';
