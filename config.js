const fs = require('fs');
const CONFIG_PATH = './config.json';

// Singleton structure in JS
var ConfigService = (function () {

  const data = fs.readFileSync(require.resolve(CONFIG_PATH));
  if (data) { 
    this.config = JSON.parse(data);
  } else {
    console.error('Error loading Nano config file. Please make a config.json at the root directory and try again.');
  }

  this.setConfigProperty = (property, value) => {
    console.log(`Attempting to change config property "${property}" to "${value}"`);
    console.log(`Value before ${this.config[property]}`);

    if (this.config) {
      this.config[property] = value;
    } else {
      console.error('No config.json loaded into memory');
    }

    console.log(`Value after ${this.config[property]}`);
    
    fs.writeFile(
      CONFIG_PATH,
      JSON.stringify(config, null, 2),
      err => console.error
    );
  }

  return this;
})();


module.exports = ConfigService;