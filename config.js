const fs = require('fs');

const CONFIG_PATH = './config.json';
let config = null;

fs.readFile(require.resolve(CONFIG_PATH), (err, data) => {
  if (err) {
    console.error('Error loading Nano config file. Please make a config.json at the root directory and try again.');
    module.exports = null;
  } else {
    config = JSON.parse(data);
    module.exports = config;
  }
});