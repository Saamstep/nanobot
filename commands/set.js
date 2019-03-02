const fs = require('fs');
const logEvent = require('../modules/logMod.js');
const consoleEvent = require('../modules/consoleMod.js');
const error = require('../modules/errorMod.js');
const ConfigService = require('../config.js');

exports.run = (client, message, args) => {
  let option = args[0];

  let isAdmin = require('../modules/isAdmin.js');
  if (isAdmin(message.author, message)) {
    switch (option) {
      case 'prefix':
        let newPrefix = args[1];
        ConfigService.setConfigProperty('prefix', newPrefix);
        message.channel.send(`New prefix is now \`${newPrefix}\``);
        logEvent(
          'New Prefix',
          `Prefix has been changed to **${newPrefix}**`,
          16776960,
          message
        );
        break;
      case 'ip':
        let newIP = args[1];
        setConfigProperty('mcIP', newIP);
        message.channel.send(`IP changed to \`${newIP}\``);
        logEvent(
          'IP Updated',
          `IP has been changed to **${newIP}**`,
          16776960,
          message
        );
        break;
      case 'port':
        let newPort = args[1];
        if (newPort == null) {
          return message.channel.send(
            `${
            ConfigService.config.prefix
            }set port reset/[port]\nReset will make the port blank.`,
            {
              code: 'ascidoc'
            }
          );
        }
        if (newPort === 'reset') {
          ConfigService.setConfigProperty('mcPort', '');
          message.channel.send(`Port reset`);
          logEvent(
            'Port Reset',
            `The current port has been removed`,
            16776960,
            message
          );
        } else {
          ConfigService.setConfigProperty('mcPort', newPort);
          message.channel.send(`Port changed to \`${newPort}\``);
          logEvent(
            'New Port',
            `Port has been changed to **${newPort}**`,
            16776960,
            message
          );
        }
        break;
      case 'acceptmessage':
        let tl = args[1];
        let newAcceptMessage = args.join(' ').slice(14);
        ConfigService.setConfigProperty('acceptMessage', newAcceptMessage);
        message.channel.send(
          `Accept message changed to \`${newAcceptMessage}\``
        );
        logEvent(
          'Accept Message',
          `Accept Message has been changed to **${newAcceptMessage}**`,
          16776960,
          message
        );
        break;
      case 'logchannel':
        let newLog = args[1];
        if (newLog.includes('#')) {
          return message.channel.send('Just write the name of the channel.');
        } else {
          ConfigService.setConfigProperty('log', newLog);
          message.channel.send(`Log channel changed to \`${newLog}\``);
          logEvent(
            'Log Channel Update',
            `Log Channel has been changed to **${newLog}**`,
            16776960,
            message
          );
        }
        break;
      case 'servername':
        let newServerName = args.join(' ').slice(11);
        ConfigService.setConfigProperty('serverName', newServerName);
        message.channel.send(`Server name changed to \`${newServerName}\``);
        logEvent(
          'Server Name',
          `Server Name has been changed to **${newServerName}**`,
          16776960,
          message
        );
        break;
      case 'debug':
        let newDebug = args[1];
        if (newDebug == 'true') {
          ConfigService.setConfigProperty('debug', true);
          consoleEvent('Debug mode was enabled');
          message.channel.send('Debug mode enabled.');
          return;
        }
        if (newDebug == 'false') {
          ConfigService.setConfigProperty('debug', false);
          consoleEvent('Debug mode was disabled');
          message.channel.send(`Debug mode disabled.`);
          return;
        } else {
          return message.channel.send('Value must be true or false.', {
            code: 'asciidoc'
          });
        }
        break;
      case 'website':
        let newSite = args[1];
        if (newSite.includes('http')) {
          ConfigService.setConfigProperty('website', newSite);
          message.channel.send('Website changed to `' + newSite + '`');
          logEvent(
            'Website Update',
            `Website has been changed to **${newLog}**`,
            16776960,
            message
          );
        } else {
          return error('This must be a valid website URL!', message);
        }
        break;
      case 'pollchannel':
        let newPoll = args[1];
        if (newPoll.includes('#')) {
          return error('Just write the name of the channel');
        } else {
          ConfigService.setConfigProperty('pollchannel', newPoll);
          message.channel.send(`Poll channel changed to \`${newPoll}\``);
          logEvent(
            'Poll Channel Update',
            `Poll channel has been changed to **${newPoll}**`,
            16776960,
            message
          );
        }
        break;
      case 'joinchannel':
        let chJoin = args[1];
        if (chJoin.includes('#')) {
          return error('Just write the name of the channel');
        } else {
          ConfigService.setConfigProperty('joinCh', chJoin);
          message.channel.send(`Join channel changed to \`${chJoin}\``);
          logEvent(
            'Join Channel Update',
            `Join channel has been changed to **${chJoin}**`,
            16776960,
            message
          );
        }
        break;
      case 'game':
        let newGame = args.join(' ').slice(5);
        if (newGame == null) {
          return message.channel.send(
            `${ConfigService.config.prefix}set game [Game Value]`,
            {
              code: 'asciidoc'
            }
          );
        }
        client.user.setPresence({ game: { name: `${newGame}`, type: 0 } });
        ConfigService.setConfigProperty('defaultGame', newGame);
        message.channel.send(
          'Updated the game status to: ' + '`' + newGame + '`'
        );
        logEvent(
          'Default Game Update',
          `Default Game has been changed to **${newGame}**`,
          16776960,
          message
        );
        break;
      case 'joinmessage':
        let newJoin = args.join(' ').slice(12);
        ConfigService.setConfigProperty('joinMsg', newJoin);
        message.channel.send(`Join message updated to \`${newJoin}\`.`);
        logEvent(
          'Join Message Update',
          `Join message changed to \`${newJoin}\``,
          16776960,
          message
        );
        break;
      case 'supportchannel':
        let newID = args[1];
        if (newID.includes('#')) {
          return error(
            'Just write the numerical ID. (Do not mention the channel).',
            message
          );
        } else {
          ConfigService.setConfigProperty('supportChannelid', newID);
          message.channel.send(`Support channel  updated to <#${newID}>.`);
          logEvent(
            'Support Channel Update',
            `The support channel was changed to <#${newID}>.`,
            16776960,
            message
          );
        }
        break;
      case 'nicknamechannel':
        let nickID = args[1];
        if (nickID.includes('#')) {
          return error(
            'Just write the numerical ID. (Do not mention the channel).',
            message
          );
        } else {
          ConfigService.setConfigProperty('nickChannelid', nickID);
          message.channel.send(`Support channel  updated to <#${nickID}>.`);
          logEvent(
            'Nickname Channel Update',
            `The nickname channel was changed to <#${nickID}>.`,
            16776960,
            message
          );
        }
        break;
      case 'leavemessage':
        let newLeave = args.join(' ').slice(12);
        ConfigService.setConfigProperty('leaveMsg', newLeave);
        message.channel.send(`Join message updated to \`${newLeave}\`.`);
        logEvent(
          'Leave Message Update',
          `Leave message changed to \`${newLeave}\``,
          16776960,
          message
        );
        break;
      case 'urls':
        if (args[1] == 'add') {
          message.channel.send(`Adding \`${args[2]}\` to the list of URLS...`)
          return ConfigService.setConfigProperty("urls", (ConfigService.config.urls || []).concat(args[2]))
        } else if (args[1] === 'del') {
          const urlIndex = ConfigService.config.urls.indexOf(args[2]);

          if (urlIndex < 0) {
            return error("URL not found");
          }

          ConfigService.config.urls.splice(urlIndex, 1);
          ConfigService.setConfigProperty("urls", ConfigService.config.urls);
          return message.channel.send(`Removed ${args[2]} from the urls list`);
        }

        if (args[1] !== 'add' && args[1] !== 'del') {
          return message.channel.send(`${ConfigService.config.prefix}set urls [add/del] [url]`, { code: 'asciidoc' })
        }
        break;
      case 'supporttags':
        if (args[1] == 'add') {
          message.channel.send(`Adding \`${args[2]}\` to the list of support tags...`)
          return ConfigService.setConfigProperty("supportTags", (ConfigService.config.supportTags || []).concat(args[2]))
        } else if (args[1] === 'del') {
          const tagIndex = ConfigService.config.supportTags.indexOf(args[2]);

          if (tagIndex < 0) {
            return error("Tag not found");
          }

          ConfigService.config.supportTags.splice(tagIndex, 1);
          ConfigService.setConfigProperty("supportTags", ConfigService.config.supportTags);
          return message.channel.send(`Removed ${args[2]} from the support tags list`);
        }

        if (args[1] !== 'add' && args[1] !== 'del') {
          return message.channel.send(`${ConfigService.config.prefix}set supporttags [add/del] [tag]`, { code: 'asciidoc' })
        }
        break;
      case 'twitchmention':
        if (args[1].includes('@')) {
          let role = args[1];
          ConfigService.setConfigProperty('mentionNotify', role);
          message.channel.send(`Twitch mention role updated to ${role}`);
        } else {
          error('This time, mention the role.', message);
        }
        break;
      case 'twitchchannel':
        if (!args[1].includes('#')) {
          let newChannel = args[1];
          ConfigService.setConfigProperty('twitchChannel', newChannel);
          message.channel.send(`Twitch channel updated to #${newChannel}`);
        } else {
          error('Just write the name of the channel.', message);
        }
        break;
      case 'streamers':
        if (args[1] === 'add') {
          message.channel.send(`Adding \`${args[2]}\` to the list of streamers...`)
          return ConfigService.setConfigProperty("streamers", (ConfigService.config.streamers || []).concat(args[2]))
        } else if (args[1] === 'del') {
          const streamerIndex = ConfigService.config.streamers.indexOf(args[2]);

          if (streamerIndex < 0) {
            return error("Streamer not found");
          }

          ConfigService.config.streamers.splice(streamerIndex, 1);
          ConfigService.setConfigProperty("streamers", ConfigService.config.streamers);
          return message.channel.send(`Removed ${args[2]} from the streamer list`);
        }

        if (args[1] !== 'add' && args[1] !== 'del') {
          return message.channel.send(`${ConfigService.config.prefix}set streamers [add/del] [twitch username]`, { code: 'asciidoc' })
        }
      case 'whitelist':
        if (args[1] == 'add') {
          message.channel.send(`Adding \`${args[2]}\` to the email whitelist...`)
          return ConfigService.setConfigProperty("whitelist", (ConfigService.config.whitelist || []).concat(args[2]))
        } else if (args[1] === 'del') {
          const wlIndex = ConfigService.config.whitelist.indexOf(args[2]);

          if (wlIndex < 0) {
            return error("Email not found");
          }

          ConfigService.config.streamers.splice(wlIndex, 1);
          ConfigService.setConfigProperty("whitelist", ConfigService.config.whitelist);
          return message.channel.send(`Removed ${args[2]} from the whitelist`);
        }

        if (args[1] !== 'add' && args[1] !== 'del') {
          return message.channel.send(`${ConfigService.config.prefix}set whitelist [add/del] [email]`, { code: 'asciidoc' })
        }
        break;
      default:
        //usage
        message.channel.send(
          `['Bot_Settings']\n\n"You can edit these values with '${
          ConfigService.config.prefix
          }set [option] [new value]'\nOptions are the names in gold with with no spaces and no caps!\nEx: ?set logchannel logger"` +
          `\n\n\n'General'\nPrefix: "${
          ConfigService.config.prefix
          }"\nDebug: "${ConfigService.config.debug}"\n'Channels'\nLog Channel: "#${ConfigService.config.log}"\n\Poll Channel: "#${
          ConfigService.config.pollchannel
          }"\nJoin Channel: "#${
          ConfigService.config.joinCh
          }"\nTwitch Channel: "#${
          ConfigService.config.twitchChannel}"` +
          `\nAccept Message: "${ConfigService.config.acceptMessage}"\nIP: "${
          ConfigService.config.mcIP
          }"\nPort: "${
          ConfigService.config.mcPort
          } (Leave empty if none)"\nWebsite: "${
          ConfigService.config.website
          }"\nSupport Channel "${
          ConfigService.config.supportChannelid
          }"\nSupport Tags: "${
          ConfigService.config.supportTags.join(', ')
          }"\n'Text'\nJoin Message: "${
          ConfigService.config.joinMsg
          }"\nLeave Message: "${
          ConfigService.config.leaveMsg
          }"\nNickname Channel: "${
          ConfigService.config.nickChannelid
          }"\nGame: "${ConfigService.config.defaultGame}"` +
          `\nThumbs Up URLs: "${
          ConfigService.config.urls
          }"\nStreamers: "${ConfigService.config.streamers.join(', ')}"\n'MC_Server'\nServer Name: "${
          ConfigService.config.serverName
          }"\n'Roles'\nMod Role: "${
          ConfigService.config.modrolename
          }"\nAdmin Role: "${
          ConfigService.config.adminrolename
          }"\nMember Role: "${
          ConfigService.config.memberrole
          }"\nTwitch Mention: "${ConfigService.config.mentionNotify}"`,
          { code: 'ml' }
        );
    }
  }
};
exports.description = "Allows admins to change the bot's settings.";
