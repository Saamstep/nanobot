exports.run = (client, message, args) => {
  const data = require('../toornament.json');

  switch (args[0]) {
    case 'list':
      let msg = '';
      for (game in data) {
        msg += `**${game}** <https://www.toornament.com/en_US/tournaments/${data[game].id}/>\n`;
      }
      message.channel.send(msg);
      break;
    case 'game':
      if (!args[1]) return client.error('Please input a game search term!', message);
      let search = args[1];
      if (args[2]) search += ' ' + args[2];
      if (!data.hasOwnProperty(search)) return client.error('Invalid search term.', message);
      message.channel.send(`**${search}** <https://www.toornament.com/en_US/tournaments/${data[search].id}/>\n`);
      break;
    default:
      message.channel.send(`\`\`\`${client.ConfigService.config.prefix}hsel [list/game] [search]\`\`\``);
  }
};

exports.cmd = {
  enabled: false,
  category: 'VCHS Esports',
  level: 0,
  description: 'Interact with the toornament API.'
};
