exports.run = (client, message, args, conn) => {
  const errorMod = require('../modules/errorMod.js');
  const cM = require('../modules/consoleMod.js');
  const log = require('../modules/logMod.js');
  const config = require('../config.json');
  const ConfigService = require('../config.js');

  const cmd = args.join(' ');

  const isAdmin = require('../modules/isAdmin.js');
  if ((message.author, message)) {
    conn.send(cmd);
  }
};

exports.cmd = {
  enabled: false,
  category: 'MinecraftSMP',
  level: 2,
  description: 'Allows admins to send commands to a connected Minecraft Server'
};
