const ConfigService = require('../config.js');
const colors = require('colors');
const fetch = require('node-fetch');
const commandsFolder = './commands/';
const ccFolder = './commands/cc/';
const CommandList = require('../commandList.js');
const fs = require('fs').promises;

let bar = '+===========================================+';

exports.run = async function(client, member, message) {
  const guildNames = client.guilds.map(g => g.name).join('\n');
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
  } catch(e) {
    console.log(e);
    console.error('No commands found, please make a commands folder and put some commands in there my man'.red.bold);
    process.exit(1);
  }

  // Add custom commands to command list
  try {
    const customCommands = await fs.readdir(ccFolder);
    customCommands.forEach(file => {
      if (file.startsWith('.')) {
        return;
      } else {
        let cmdfiles = require(`../commands/cc/${file}`);
        CommandList.addCommand(file.toString().replace('.js', ''), true, cmdfiles.description);          
      }
    });
  } catch(e) {
    console.error('No custom file directory exists, please create a cc folder in the commands directory'.red);
  }


  // Discord status URL
  var url = 'https://srhpyqt94yxb.statuspage.io/api/v2/status.json/';

  // Start discord status
  const response = await fetch(url);

  const body = await response.json();

  if (!response.ok) {
    throw Error('Error: DISCORD_STATUS_REQUEST. Please tell the bot author.');
  }

  var indicator = body.status.indicator;
  var desc = body.status.description;

  if (body.status.description == 'All Systems Operational') {
    console.log(bar.yellow);
    console.log('[Discord Status] All Systems Operational\n'.green);
  } else {
    console.log(bar.yellow);
    console.log(
      '[Discord Status] There seems to be an error within Discord. Double check https://status.discordapp.com/ \n'
      .red
    );
  }
  // End discord status

  console.log(
    `${ConfigService.config.serverName}`.underline.cyan +
      ' bot is online!\n'.cyan +
      `\nConnected to:`.cyan +
      `\n${guildNames}`.italic.cyan
  );
  console.log(
    '\n[IMPORTANT] KEEP THIS WINDOW OPEN FOR BOT TO STAY ONLINE'.bold.red
  );
  console.log(bar.yellow);

  if (ConfigService.config.debug === 'on') {
    console.log('\nErrors will appear below.\n'.italic.green);
  }
};
