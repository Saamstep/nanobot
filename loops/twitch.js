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
            'Client-ID': `${client.ConfigService.config.apis.twitch}`
          }
        });
        const body = await request.json();

        //if live, get the game they are playing and profile picture
        let game = '';
        let pfp = '';
        let display = '';
        if (body.data[0] && !twitch.has(element)) {
          const gameID = await fetch(`https://api.twitch.tv/helix/games?id=${body.data[0].game_id}`, {
            headers: {
              'Client-ID': `${client.ConfigService.config.apis.twitch}`
            }
          });
          const gameName = await gameID.json();
          game += gameName.data[0].name;

          const userID = await fetch(`https://api.twitch.tv/helix/users?id=${body.data[0].user_id}`, {
            headers: {
              'Client-ID': `${client.ConfigService.config.apis.twitch}`
            }
          });
          const userInfo = await userID.json();
          pfp += userInfo.data[0].profile_image_url;
          display += userInfo.data[0].display_name;
        }

        //if not live. dont send anything! but check if streamer is in checker and remove streamer
        if (!body.data[0]) {
          client.console('Twitch | Found ' + element.magenta.dim + ' is not live');
          twitch.defer.then(() => {
            if (twitch.has(element)) {
              client.console('Twitch | Found ' + element.magenta.dim + ' was live and is no longer.');
              twitch.delete(element);
            }
          });
        } else {
          //if they go offline set them to status offline
          twitch.defer.then(() => {
            //if live... run this code
            if (!twitch.has(element)) {
              // Message formatter for the notificiations
              const embed = {
                description: '**' + body.data[0].title + '**',
                url: 'http://twitch.tv/' + element,
                color: 6684837,
                footer: {
                  icon_url: client.user.avatarURL,
                  text: client.user.username + ' - Twitch',
                  timestamp: Date.now()
                },
                image: {
                  url: `${body.data[0].thumbnail_url.replace('{width}', '1920').replace('{height}', '1080')}`
                },
                thumbnail: {
                  url: `${pfp}`
                },
                author: {
                  name: display + ' is live',
                  url: 'http://twitch.tv/' + element,
                  icon_url:
                    'https://cdn4.iconfinder.com/data/icons/social-media-circle-long-shadow/1024/long-10-512.png'
                },
                fields: [
                  {
                    name: 'Game',
                    value: `${game}`,
                    inline: true
                  },
                  {
                    name: 'Link',
                    value: 'http://twitch.tv/' + element,
                    inline: true
                  },
                  {
                    name: 'Viewers',
                    value: `${body.data[0].viewer_count}`
                  }
                ]
              };

              // Add streamer name to a set
              twitch.set(element, true);
              sendMessage(`${client.ConfigService.config.channel.twitch}`, { embed });
              client.console('Twitch | Found ' + element.magenta.dim + ' is live! Sent the announcement.');
            }
          });
        }
      } catch (e) {
        client.console(e);
      }
    });
  }
  twitchNotifier();
};
exports.time = 180000;
