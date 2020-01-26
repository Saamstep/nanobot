exports.run = (client, dupe, veriEnmap, sendMessage) => {
    var Rcon = require('rcon');

        if(Object.values(client.ConfigService.config.smp.rcon)[0] == "" || Object.values(client.ConfigService.config.smp.rcon)[1] == null) {
             client.error('There is no rcon username and/or port in the config file.', message);
            return process.exit(1);
        }

var conn = new Rcon(client.ConfigService.config.smp.ip, client.ConfigService.config.smp.rcon.port, client.ConfigService.config.smp.rcon.pass);
conn.on('auth', function() {
  client.console(`Authorized and connected to server ${client.ConfigService.config.smp.ip}`, 'info', 'RCON');

}).on('error', function(error) {
  client.console(`Server ${client.ConfigService.config.smp.ip} :: ${error}`, 'error', 'RCON')

}).on('end', function() {
  client.console(`Socket closed with server ${client.ConfigService.config.smp.ip}`, 'warn', 'RCON');
  if(client.ConfigService.config.smp.rcon.autoRestart) {
    conn.connect();
  }

});

conn.connect();

client.rcon = conn;

};


