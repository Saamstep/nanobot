exports.run = (client, owl, youtube, twitch, sendMessage) => {
  const fetch = require('node-fetch');
  async function twitchNotifier() {
    // List of streamers to get notifications for
    client.ConfigService.config.streamers.forEach(async element => {
      // Makes request
      try {
        client.console('Twitch | Getting streamer status: ' + element.magenta.dim);
        const request = await fetch(`https://api.twitch.tv/helix/streams?user_login=${element}`, {
          headers: {
            'User-Agent': 'D.js-Bot-Dev',
            'Client-ID': `${client.ConfigService.config.apis.twitch}`,
            'content-type': 'application/json'
          }
        });
        const body = await request.json();
        if (!body.data) {
          return client.console('Twitch | Found ' + element.magenta.dim + ' is not live');
        }
        twitch.defer.then(() => {
          if (!twitch.has(element)) {
            // Message formatter for the notificiations

            // try {
            //   const req = await fetch(`https://api.twitch.tv/helix/streams?user_login=${element}`)
            // }

            const embed = {
              description: '**' + body.data[0].title + '**',
              url: 'http://twitch.tv/' + element,
              color: 6684837,
              footer: {
                icon_url: 'https://cdn4.iconfinder.com/data/icons/social-media-circle-long-shadow/1024/long-10-512.png',
                text: client.user.username + ' Bot'
              },
              thumbnail: {
                url: profilepicture
              },
              author: {
                name: element + ' is live',
                url: 'http://twitch.tv/' + element,
                icon_url: 'https://cdn4.iconfinder.com/data/icons/social-media-circle-long-shadow/1024/long-10-512.png'
              },
              fields: [
                {
                  name: 'Game',
                  value: game,
                  inline: true
                },
                {
                  name: 'Link',
                  value: 'http://twitch.tv/' + element,
                  inline: true
                },
                {
                  name: 'Viewers',
                  value: body.data[0].viewer_count
                }
              ]
            };

            // Add streamer name to a set
            twitch.set(element, true);
            sendMessage(`${client.ConfigService.config.channel.twitch}`, { embed });
            client.console('Twitch | Found ' + element.magenta.dim + ' is live! Sending the announcement...');
          } else if (twitch.has(element) && body._total < 1) {
            twitch.delete(element);
            return;
          }
        });
        // });
      } catch (e) {
        client.console(e);
      }
    });
  }
  twitchNotifier();
};
exports.time = 180000;
