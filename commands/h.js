exports.run = (client, message, args) => {
  const fs = require('fs');
  const arrays = {
    fun: [],
    utility: [],
    moderation: [],
    mcsmp: [],
    esports: [],
    admin: [],
    games: [],
    other: []
  };
  let commands = fs.readdirSync('./commands/');
  // files.forEach(file => {
  let mod = false;
  let ad = false;
  if (client.isMod(message.author, message, client)) mod = true;
  if (client.isAdmin(message.author, message, false, client)) ad = true;
  commands.forEach(function(file) {
    if (file == '.DS_Store' || !file.includes('.js')) return;
    //command name
    let name = file.split('.')[0];
    let data = require(`../commands/${file}`).cmd;
    //description
    let val = data.enabled ? data.description : '*' + data.description;
    let template = `> ${client.ConfigService.config.prefix}${name}\n‣\`${val}\`\n`;
    switch (data.category) {
      case 'Fun':
        arrays.fun.push(template);
        break;
      case 'Utility':
        arrays.utility.push(template);
        break;
      case 'Moderation':
        if (!mod) return;
        arrays.moderation.push(template);
        break;
      case 'MinecraftSMP':
        arrays.mcsmp.push(template);
        break;
      case 'VCHS Esports':
        arrays.esports.push(template);
        break;
      case 'Admin':
        if (!ad) return;
        arrays.admin.push(template);
        break;
      case 'Games':
        arrays.games.push(template);
        break;
      default:
        arrays.other.push(template);
    }
  });

  Object.keys(arrays).forEach(arr => {
    if (arr == 'moderation' && !mod) return;
    if (arr == 'admin' && !ad) return;
    let embed = {
      description: arrays[arr].join(''),
      author: {
        name: arr + ' commands'
      },
      footer: {
        text: `${client.user.username}`
      }
    };
    message.author.send({ embed });
    // setTimeoutmessage.channel.send(arrays[arr]);
  });
  message.react('✅');
};

exports.cmd = {
  enabled: true,
  category: 'Utility',
  level: 0,
  description: 'Get info about all the commands'
};
