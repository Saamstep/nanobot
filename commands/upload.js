exports.run = async (client, message, args, veriEnmap, cc) => {
  const fetch = require('node-fetch');
  const fs = require('fs');
  //Get URL of clip

  if (!args[0] || !args[0].includes('https://clips.twitch.tv'))
    return client.error('Please provide a valid Twitch clips URL!', message);
  //https://clips.twitch.tv/AwkwardHelplessSalamanderSwiftRage
  let id = args[0].slice(24);

  const clipRequest = await fetch('https://api.twitch.tv/helix/clips?id=' + id, {
    headers: {
      'Client-ID': client.ConfigService.config.apis.twitch
    }
  });
  const clip = await clipRequest.json();
  if (clip.data < 1 || undefined) return client.error('invalid clip ID', message);
  // if (!args[1]) return client.error('Please supply a path!', message);
  // var path;
  // switch (args[1]) {
  //   case 'OW Blue':
  //     path = '';
  //     break;
  // }
  let name = clip.data[0].title;
  let creator = clip.data[0].creator_name;
  let bcaster = clip.data[0].broadcaster_name;

  const download = await fetch(`https://clips.twitch.tv/api/v1/clips/${id}/status`);
  const DLfile = await download.json();
  let fileURL = DLfile.quality_options[0].source;
  message.channel.send(fileURL);
  const { google } = require('googleapis');

  async function oauth() {
    const oauth2Client = new google.auth.OAuth2(
      '76213715843-u8dipqgg54cuk0an0ks9ou7hlun5fc0c.apps.googleusercontent.com',
      '4dlVHK1IWU7F1jruGvHMkS-N'
    );
    const url = oauth2Client.generateAuthUrl({
      // 'online' (default) or 'offline' (gets refresh_token)
      access_type: 'offline',

      // If you only need one scope you can pass it as a string
      scope: 'https://www.googleapis.com/auth/drive'
    });
    console.log(url);
  }
  oauth();

  const drive = google.drive({
    version: 'v3',
    auth: oauth2Client
  });
  async function main() {
    const res = await drive.files.create({
      requestBody: {
        name: 'testimage.png',
        mimeType: 'image/png'
      },
      media: {
        mimeType: 'image/png',
        body: fs.createReadStream('./file.png')
      }
    });
    console.log(res.data);
  }
  main();
};

exports.cmd = {
  enabled: false,
  category: 'VCHS Esports',
  level: 3,
  description: '(PreALPHA) Upload Twitch clips from Discord!'
};
