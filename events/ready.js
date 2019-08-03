const ConfigService = require('../config.js');
const colors = require('colors');
const fetch = require('node-fetch');
const commandsFolder = './commands/';
const ccFolder = './commands/cc/';
const CommandList = require('../commandList.js');
const fs = require('fs').promises;

exports.run = async function(client, member, message) {
  const guildNames = client.guilds.map(g => g.name).join(', ');
  client.user
    .setPresence({
      game: { name: `${ConfigService.config.defaultGame}`, type: 0 }
    })
    .catch(console.error);

  // Iterate over all commands in command folder and add to CommandList
  try {
    const commands = await fs.readdir(commandsFolder);
    commands.forEach(file => {
      if (file === 'cc') {
        return;
      }
      if (file.startsWith('.')) {
        return;
      } else {
        let cmdfiles = require(`../commands/${file}`);
        CommandList.addCommand(file.toString().replace('.js', ''), false, cmdfiles.description);
      }
    });
  } catch (e) {
    console.log(e);
  }

  // Discord status URL
  var url = 'https://srhpyqt94yxb.statuspage.io/api/v2/status.json/';

  // Start discord status
  const response = await fetch(url);

  const body = await response.json();

  if (!response.ok) {
    throw Error('Error: DISCORD_STATUS_REQUEST. The Discord API gave us a baaad response...');
  }

  if (body.status.description == 'All Systems Operational') {
    console.log('\nAll Discord systems operational!\n'.green.dim);
  } else {
    console.log(
      'There seems to be an error with some of the Discord Servers. Double check https://status.discordapp.com/ \n'.red
    );
  }
  // End discord status
  const cmds = await fs.readdir(commandsFolder);
  console.log('Loading '.green + cmds.length + ' commands'.green);
  console.log(
    `${client.user.username}`.underline.magenta +
      ' online!\n'.magenta.reset +
      'Connected to: '.cyan +
      guildNames.white +
      ' guilds'.cyan
  );
  if (ConfigService.config.debug === 'on') {
    console.log('\n');
  }
};
