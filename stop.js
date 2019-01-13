const pm2 = require('pm2');

console.log("Stopping...");

pm2.kill();


process.exit();