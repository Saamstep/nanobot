var pm2 = require('pm2');
const ConfigService = require('./config.js');

pm2.connect(function (err) {
  if (err) {
    console.error(err);
    process.exit(2);
  }

  console.log(`Starting ${ConfigService.serverName} bot...`);
  pm2.list();
  pm2.start({
    name: `${ConfigService.serverName}`,
    script: 'index.js',         // Script to be run
    max_memory_restart: '100M'   // Optional: Restarts your app if it reaches 100Mo
  }, function (err, apps) {
    pm2.disconnect();   // Disconnects from PM2
    if (err) throw err
  });
});