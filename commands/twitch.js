exports.run = async (client, message, args, veriEnmap, cc) => {
  const fetch = require('node-fetch');
  const date = require('dateformat');
  async function getUser(name) {
    const req = await fetch(`https://api.twitch.tv/helix/users?login=${name}`, {
      headers: {
        'Client-ID': `${client.ConfigService.config.apis.twitch}`
      }
    });
    const userData = await req.json();
    return await userData;
  }
  async function isLive(name) {
    const request = await fetch(`https://api.twitch.tv/helix/streams?user_login=${name}`, {
      headers: {
        'Client-ID': `${client.ConfigService.config.apis.twitch}`
      }
    });
    const streamData = await request.json();
    return await streamData;
  }
  async function getGame(game) {
    const re = await fetch(`https://api.twitch.tv/helix/games?id=${game}`, {
      headers: {
        'Client-ID': `${client.ConfigService.config.apis.twitch}`
      }
    });
    const game = await re.json();
    return await game;
  }
  switch (args[0]) {
    case 'add':
      break;
    case 'remove':
      break;
    case 'list':
      break;
    case 'user':
      if (!args[1]) return client.error('You must provide a Twitch username!', message);
      let user = await getUser(`${args[1]}`);
      if (user.data[0].length < 1) return client.error('That streamer does not exist!', message);
      const embed = {
        title: `${user.data[0].display_name} on Twitch`,
        // description: `${user.data[0].title}`,
        url: `https://twitch.tv/${user.data[0].login}`,
        color: 9442302,
        footer: {
          icon_url: client.user.avatarURL,
          text: client.user.username + ' - Twitch'
        },
        fields: [
          {
            name: 'Type',
            value: `${user.data[0].broadcaster_type.toUpperCase() || 'N/A'}`,
            inline: true
          },
          {
            name: 'Views',
            value: `${user.data[0].view_count || '0'}`,
            inline: true
          },
          {
            name: 'Description',
            value: `${user.data[0].description || 'No description set.'}`,
            inline: false
          }
        ],
        thumbnail: {
          url: `${user.data[0].profile_image_url}`
        },
        image: {
          url: `${user.data[0].offline_image_url}`
        }
      };
      message.channel.send({ embed });
      break;
    case 'live':
      if (!args[1]) return client.error('You must provide a Twitch username!', message);
      let response = await isLive(args[1]);
      if (response.data < 1) return message.channel.send('That streamer is not live!');
      else {
        const embed = {
          title: `${response.data[0].user_name} is live on Twitch!`,
          description: `${response.data[0].title}`,
          url: `https://twitch.tv/${response.data[0].user_name}`,
          color: 9442302,
          footer: {
            icon_url: client.user.avatarURL,
            text: client.user.username + ' - Twitch'
          },
          fields: [
            {
              name: 'Viewers',
              value: `${response.data[0].viewer_count}`,
              inline: true
            },
            {
              name: 'Started on',
              value: `${date(response.data[0].started_at, 'm/d/yy @ hh:MM TT')}`,
              inline: true
            }
          ],
          image: {
            url: `${response.data[0].thumbnail_url.replace(`{width}`, '1920').replace(`{height}`, '1080')}`
          }
        };
        message.channel.send({ embed });
      }
      break;
    default:
      if (!args[0]) return client.error('twitch add|remove|list|live [user (if applicable)]', message);
      break;
  }
};

exports.cmd = {
  enabled: true,
  category: 'Games',
  level: 3,
  description: 'Manage Twitch notifiactions'
};
