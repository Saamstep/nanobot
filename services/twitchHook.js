exports.run = async (client, dupe, veriEnmap, sendMessage) => {
  const http = require('http');
  const date = require('dateformat');
  const fetch = require('node-fetch');
  async function getUser(name) {
    const req = await fetch(`https://api.twitch.tv/helix/users?login=${name}`, {
      headers: {
        'Client-ID': `${client.ConfigService.config.apis.twitch}`
      }
    });
    const userData = req.json();
    return await userData;
  }
  async function getGame(game) {
    const re = await fetch(`https://api.twitch.tv/helix/games?id=${game}`, {
      headers: {
        'Client-ID': `${client.ConfigService.config.apis.twitch}`
      }
    });
    const ga = await re.json();
    return await ga;
  }
  http
    .createServer(function(req, res) {
      let body = '';
      req.setEncoding('utf8');
      req.on('data', function(chunk) {
        body += chunk;
      });
      req.on('end', async function() {
        if (body) {
          // let hash = crypto
          //   .createHmac(incoming[0], secret)
          //   .update(JSON.stringify(req.body))
          //   .digest('hex');
          // if (incoming == undefined) return client.console('TwitchHook | Unauthorized request!');

          client.console('TwitchHook Found');
          let data = JSON.parse(body).data[0];
          if (data.type == 'live') {
            const user = await getUser(data.user_name);
            const game = await getGame(data.game_id);
            let pfp = user.data[0].profile_image_url;
            const embed = {
              title: `${user.data[0].display_name} is live on Twitch!`,
              description: `${data.title}`,
              url: `https://twitch.tv/${data.user_name}`,
              color: 9442302,
              footer: {
                icon_url: client.user.avatarURL,
                text: client.user.username + ' - Twitch'
              },
              fields: [
                {
                  name: 'Viewers',
                  value: `${data.viewer_count}`,
                  inline: true
                },
                {
                  name: 'Game',
                  value: `${game.data[0].name}`,
                  inline: true
                },
                {
                  name: 'Started on',
                  value: `${date(data.started_at, 'm/d/yy @ hh:MM TT')}`,
                  inline: false
                }
              ],
              image: {
                url: `${data.thumbnail_url.replace(`{width}`, '1920').replace(`{height}`, '1080')}`
              },
              thumbnail: {
                url: `${pfp}`
              }
            };
            sendMessage(client.ConfigService.config.channel.twitch, { embed });
          }
        }
      });
      res.end('<h1>TwitchLive</h1>');
    })
    .listen(9697);
  const url = require('url');
  const requestHandler = (request, response) => {
    console.log(request.headers);
    console.log(request.url);
    response.writeHead(200);
    var parts = url.parse(request.url, true);
    var challenge = parts.query['hub.challenge'];
    console.log(`challenge: ${challenge}`);
    response.end(challenge);
  };

  http.createServer(requestHandler).listen(9696, err => {
    if (err) {
      return console.log('something bad happened', err);
    }
    console.log(`server is listening on 9696`);
  });
};
