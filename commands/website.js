const config = require('../config.json');
const errorMod = require('../modules/errorMod.js');
exports.run = (client, message, args) => {
  message.channel.send(config.website);
};
