exports.run = (client, dupe, veriEnmap, sendMessage) => {
  const http = require('http');
  http
    .createServer(function(req, res) {
      let body = '';
      req.setEncoding('utf8');
      req.on('data', function(chunk) {
        body += chunk;
      });
      req.on('end', function() {
        if (body) {
          client.console('TwitchHook Found');
          let data = JSON.parse(body);
          console.log(data);
        }
      });
      res.end('<h1>TwitchLive</h1>');
    })
    .listen(9696);
};
