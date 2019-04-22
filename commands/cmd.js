exports.run = (client, message, args) => {
  // const errorMod = require('../modules/errorMod.js');
  // const cM = require('../modules/consoleMod.js');
  // const log = require('../modules/logMod.js');
  // const config = require('../config.json');
  // const ConfigService = require('../config.js');
  // var Rcon = require('rcon');
  // var updatedport = Number(ConfigService.config.rconPort);
  // var conn = new Rcon(
  //   `${ConfigService.config.mcIP}`,
  //   updatedport,
  //   `${ConfigService.config.rconPass}`
  // );
  // let cmd = args.join(' ');

  // let isAdmin = require('../modules/isAdmin.js');
  // if (isAdmin(message.author, message)) {
  //   async function commander() {
  //     await conn.connect();
  //     await conn.send(cmd);
  //     await cM(`Command ${cmd} sent by ${message.author}`);
  //     await log('RCON', `/${cmd}`, 16774912, message);
  //     await message.channel.send('Command: `' + cmd + '` sent');
  //     await conn.disconnect();
  //   }
  //   try {
  //     commander();
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }
  message.reply(';)');
};

exports.description =
  'Allows you to run MC Server commands using Remote Console';
