exports.run = (client, message, args) => {

  const errorMod = require('../modules/errorMod.js');
  const cM = require('../modules/consoleMod.js');
  const log = require('../modules/logMod.js');
  const config = require('../config.json');
  let updatedport = Number(config.rconPort);
  const Rcon = require('modern-rcon');
  const rcon = new Rcon(`${config.mcIP}`, port = updatedport, 'pass');
  let cmd = args.join(' ');

  let modRole = message.member.roles.find('name', `${config.modrolename}`);

  if (!message.member.roles.has(modRole.id)) {
    return errorMod('You do not have the right permissions', message);
  }

  rcon.connect().then(() => {
    rcon.send(cmd);
    cM(`Command ${cmd} sent by ${message.author}`);
    log("RCON", `/${cmd}`, 16774912, message);
    message.channel.send('Command: `' + cmd + "` sent");
  }).then(() => {
    return rcon.disconnect();
  }
  )



}

exports.description = "Allows you to run MC Server commands using Remote Console"; 