exports.run = (client, member, message) => {
  const log = require('../modules/logMod');
  var config = require('../config.json');

  log('Member Banned', `${member} was banned`, message);

};
