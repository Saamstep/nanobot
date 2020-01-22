exports.run = (client, dupe, veriEnmap, sendMessage) => {
  //tests if process is alive with http server
  let types = ["READY", "CONNECTING", "RECONNECTING", "IDLE", "NEARLY", "DISCONNECTED"];
  const http = require("http");
  const fs = require("fs");
  var options = {
    // key: fs.readFileSync('./https/key.pem'),
    // cert: fs.readFileSync('./https/csr.pem'),
    method: "POST",
    path: "./"
  };
  http
    .createServer(options, function(req, res) {
      res.writeHead(200, { "Content-Type": "application/json" });
      const alive = {
        status: `${types[client.status]}`,
        bot: `${client.user.username}#${client.user.discriminator}`,
        api_ping: `${client.ping}`,
        uptime: `${client.uptime}`
      };
      res.write(JSON.stringify(alive), null, 3);
      res.end();
    })
    .listen(3000);
};
