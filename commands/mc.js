const config = require('../config.json');
const errorMod = require('../modules/errorMod.js');
exports.run = (client, message, args) => {
  var data = require('minecraft-data')('1.9.0');

  errorMod('Coming soon.', message);
  // console.log(data.recipes);
};
