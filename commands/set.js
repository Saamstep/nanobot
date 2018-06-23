// const config = require('../config.json');
// const fs = require('fs');
// const logEvent = require('../modules/logMod.js');
// const consoleEvent = require('../modules/consoleMod.js');
// const error = require('../modules/errorMod.js');

exports.run = (client, message, args) => {
  //   let option = args[0];
  //   let adminRole = message.guild.roles.find('name', `${config.adminrolename}`);
  //   // allows you to change options from config.json file
  //   if (!message.member.roles.has(adminRole.id)) {
  //     return error('You do not have the right permissions!', message);
  //   }

  //   switch (option) {
  //     case 'prefix':
  //       let newPrefix = args[1];
  //       config.prefix = newPrefix;
  //       fs.writeFile(
  //         '../config.json',
  //         JSON.stringify(config, null, 2),
  //         err => console.error
  //       );
  //       message.channel.send(`New prefix is now \`${newPrefix}\``);
  //       logEvent(
  //         'New Prefix',
  //         `Prefix has been changed to **${newPrefix}**`,
  //         16776960,
  //         message
  //       );
  //       break;
  //     case 'ip':
  //       let newIP = args[1];
  //       config.mcIP = newIP;
  //       fs.writeFile(
  //         '../config.json',
  //         JSON.stringify(config, null, 2),
  //         err => console.error
  //       );
  //       message.channel.send(`IP changed to \`${newIP}\``);
  //       logEvent(
  //         'IP Updated',
  //         `IP has been changed to **${newIP}**`,
  //         16776960,
  //         message
  //       );
  //       break;
  //     case 'port':
  //       let newPort = args[1];
  //       if (newPort == null) {
  //         return message.channel.send(
  //           `${
  //           config.prefix
  //           }set port reset/[port]\nReset will make the port blank.`,
  //           {
  //             code: 'ascidoc'
  //           }
  //         );
  //       }
  //       if (newPort === 'reset') {
  //         config.mcPort = '';
  //         fs.writeFile(
  //           '../config.json',
  //           JSON.stringify(config, null, 2),
  //           err => console.error
  //         );
  //         message.channel.send(`Port reset`);
  //         logEvent(
  //           'Port Reset',
  //           `The current port has been removed`,
  //           16776960,
  //           message
  //         );
  //       } else {
  //         config.mcPort = newPort;
  //         fs.writeFile(
  //           '../config.json',
  //           JSON.stringify(config, null, 2),
  //           err => console.error
  //         );
  //         message.channel.send(`Port changed to \`${newPort}\``);
  //         logEvent(
  //           'New Port',
  //           `Port has been changed to **${newPort}**`,
  //           16776960,
  //           message
  //         );
  //       }
  //       break;
  //     case 'acceptmessage':
  //       let tl = args[1];
  //       let newAcceptMessage = args.join(' ').slice(14);
  //       config.acceptMessage = newAcceptMessage;
  //       fs.writeFile(
  //         '../config.json',
  //         JSON.stringify(config, null, 2),
  //         err => console.error
  //       );
  //       message.channel.send(`Accept message changed to \`${newAcceptMessage}\``);
  //       logEvent(
  //         'Accept Message',
  //         `Accept Message has been changed to **${newAcceptMessage}**`,
  //         16776960,
  //         message
  //       );
  //       break;
  //     case 'logchannel':
  //       let newLog = args[1];
  //       if (newLog.includes('#')) {
  //         return message.channel.send('Just write the name of the channel.');
  //       } else {
  //         config.log = newLog;
  //         fs.writeFile(
  //           './config.json',
  //           JSON.stringify(config, null, 2),
  //           err => console.error
  //         );
  //         message.channel.send(`Log channel changed to \`${newLog}\``);
  //         logEvent(
  //           'Log Channel Update',
  //           `Log Channel has been changed to **${newLog}**`,
  //           16776960,
  //           message
  //         );
  //       }
  //       break;
  //     case 'servername':
  //       let newServerName = args.join(' ').slice(11);
  //       config.serverName = newServerName;
  //       fs.writeFile(
  //         '../config.json',
  //         JSON.stringify(config, null, 2),
  //         err => console.error
  //       );
  //       message.channel.send(`Server name changed to \`${newServerName}\``);
  //       logEvent(
  //         'Server Name',
  //         `Server Name has been changed to **${newServerName}**`,
  //         16776960,
  //         message
  //       );
  //       break;
  //     case 'debug':
  //       let newDebug = args[1];
  //       if (newDebug === 'on') {
  //         config.debug = newDebug;
  //         fs.writeFile(
  //           '../config.json',
  //           JSON.stringify(config, null, 2),
  //           err => console.error
  //         );
  //         consoleEvent('Debug mode was enabled');
  //         message.channel.send('Debug mode enabled.');
  //         return;
  //       }
  //       if (newDebug === 'off') {
  //         config.debug = newDebug;
  //         fs.writeFile(
  //           '../config.json',
  //           JSON.stringify(config, null, 2),
  //           err => console.error
  //         );
  //         consoleEvent('Debug mode was disabled');
  //         message.channel.send(`Debug mode disabled.`);
  //         return;
  //       } else {
  //         return message.channel.send('Value must be ON or OFF.');
  //       }
  //       break;
  //     case 'website':
  //       let newSite = args[1];
  //       if (newSite.includes('http')) {
  //         config.website = newSite;
  //         fs.writeFile(
  //           '../config.json',
  //           JSON.stringify(config, null, 2),
  //           err => console.error
  //         );
  //         message.channel.send('Website changed to `' + newSite + '`');
  //         logEvent(
  //           'Website Update',
  //           `Website has been changed to **${newLog}**`,
  //           16776960,
  //           message
  //         );
  //       } else {
  //         return error('This must be a valid website URL!', message);
  //       }
  //       break;
  //     case 'pollchannel':
  //       let newPoll = args[1];
  //       if (newPoll.includes('#')) {
  //         return error('Just write the name of the channel');
  //       } else {
  //         config.pollchannel = newPoll;
  //         fs.writeFile(
  //           '../config.json',
  //           JSON.stringify(config, null, 2),
  //           err => console.error
  //         );
  //         message.channel.send(`Poll channel changed to \`${newPoll}\``);
  //         logEvent(
  //           'Poll Channel Update',
  //           `Poll channel has been changed to **${newPoll}**`,
  //           16776960,
  //           message
  //         );
  //       }
  //       break;
  //     case 'defaultgame':
  //       let newGame = args[1];
  //       config.defaultGame = newGame;
  //       fs.writeFile(
  //         '../config.json',
  //         JSON.stringify(config, null, 2),
  //         err => console.error
  //       );
  //       message.channel.send(`Default game changed to \`${newGame}\``);
  //       logEvent(
  //         'Default Game Update',
  //         `Default Game has been changed to **${newGame}**`,
  //         16776960,
  //         message
  //       );
  //       break;
  //     case 'joinmessage':
  //       let newJoin = args.join(' ').slice(12)
  //       fs.writeFile('../config.json', JSON.stringify(config, null, 2), err => console.error);
  //       message.channel.send(`Join message updated to \`${newJoin}\`.`);
  //       logEvent(
  //         'Join Message Update',
  //         `Join message changed to \`${newJoin}\``,
  //         16776960,
  //         message
  //       );
  //       break;
  //     default:
  //       //usage
  //       message.channel.send(
  //         `[Bot Settings]\n\nYou can edit these values with ${
  //         config.prefix
  //         }set [option] [newOne]\nOptions are the names in between the equal signs with no spaces and no caps!` +
  //         `\n\n[Usage]\nPrefix: '${config.prefix}'\nLog Channel: '${
  //         config.log
  //         }'\n\Poll Channel: '${config.pollchannel}'\nJoin Channel: '${
  //         config.joinCh
  //         }'\nDebug: '${config.debug}'\nDefault Game: '${config.defaultGame}'` +
  //         `\n[Text]\nServer Name: '${config.serverName}'\nAccept Message: '${
  //         config.acceptMessage
  //         }'\nIP: '${config.mcIP}'\nPort: '${
  //         config.mcPort
  //         } (Leave empty if none)'\nWebsite: '${config.website}'\nJoin Message: '${config.joinMsg}'` +
  //         `\n[Roles]\nMod Role: '${config.modrolename}'\nAdmin Role: '${
  //         config.adminrolename
  //         }'\nMember Role: '${config.memberrole}'\n`,
  //         { code: 'css' }
  //       );
  //   }
  message.channel.send('This command is currently not functional D:')
};
exports.description = "Allows admins to change the bot's settings. BROKEN";
