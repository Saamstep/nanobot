exports.run = (client, dupe, sendMessage) => {
  const fetch = require('node-fetch');
  //YT Video
  async function youtubeNotifier() {
    client.ConfigService.config.youtubeChannels.forEach(async function(id) {
      client.console('YouTube | Searching for new videos...');
      const api = await fetch(
        `https://www.googleapis.com/youtube/v3/search?key=${client.ConfigService.config.apis.youtube}&channelId=${id}&part=snippet,id&order=date&maxResults=1`
      );
      const channel = await api.json();
      if (!dupe.has(channel.items[0].id.videoId)) {
        client.console('YouTube | Found channel video to announce!');
        let youtubeURL = `https://youtu.be/${channel.items[0].id.videoId}`;
        const embed = {
          url: `${youtubeURL}`,
          color: 15076647,
          timestamp: `${channel.items[0].snippet.publishedAt}`,
          footer: {
            text: 'YouTube Notifier'
          },
          image: {
            url: `${channel.items[0].snippet.thumbnails.medium.url}`
          },
          author: {
            name: `${channel.items[0].snippet.channelTitle} Uploaded`,
            url: `${youtubeURL}`,
            icon_url: 'https://seeklogo.com/images/Y/youtube-square-logo-3F9D037665-seeklogo.com.png'
          },
          fields: [
            {
              name: 'Title',
              value: `${channel.items[0].snippet.title}`
            },
            {
              name: 'Video Link',
              value: `${youtubeURL}`
            }
          ]
        };
        // client.guilds.map(guild => {
        //   if (guild.available) {
        //     let channel = guild.channels.find(
        //       channel => channel.name === `${client.ConfigService.config.channel.youtube}`
        //     );
        //     if (channel) {
        //       channel.send({ embed });
        //     }
        //   }
        // });

        sendMessage(client.ConfigService.config.channel.youtube, { embed });

        if (channel.items) dupe.set(`${channel.items[0].id.videoId}`, true);
      } else {
        client.console(`YouTube | Already announced ${channel.items[0].id.videoId}`);
      }
    });
  }
  youtubeNotifier();
};
exports.time = 300000;
