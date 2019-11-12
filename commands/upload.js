exports.run = async (client, message, args, veriEnmap, cc) => {
  const fetch = require('node-fetch');
  //Get URL of clip
  if (!args[0] || !args[0].includes('https://clips.twitch.tv'))
    return client.error('Please provide a valid Twitch clips URL!', message);
  //https://clips.twitch.tv/AwkwardHelplessSalamanderSwiftRage
  let id = args[0].slice(24);
  console.log(id);
  const clipRequest = await fetch('https://api.twitch.tv/helix/clips?id=' + id);
  const clip = await clipRequest.json();
  if (clip.data < 1) return client.error('invalid clip ID', message);
};

exports.cmd = {
  enabled: true,
  category: 'VCHS Esports',
  level: 3,
  description: '(PreALPHA) Upload Twitch clips from Discord!'
};
