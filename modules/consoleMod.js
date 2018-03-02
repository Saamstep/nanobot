module.exports = function consoleEvent(event) { 
  const config = require('../config.json');

    var dateFormat = require('dateformat')
    let now = new Date();
    let timeFormat = dateFormat(now)

  console.log("[LOG] " + "[" + timeFormat + "] " + event);
   
  };




