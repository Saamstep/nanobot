const Discord = require('discord.js');
const client = new Discord.Client({ autoReconnect: true });
const bot = new Discord.Client({ autoReconnect: true });
const ConfigService = require('./config.js');
client.login(ConfigService.config.token);
const fs = require('fs');
const request = require('request');

// client.on("ready", () => {
//   client.user.setPresence({game: {name: "Minecraft", type: 0} }).catch(console.error);
//   console.log(`\n\n[${ConfigService.configserverName} ] bot is online!`.green)
//   console.log(`\n\nBot successfully running. Keep this window open!\n\n`.red)
//   console.log(`Prefix: ${ConfigService.configprefix}`.blue);
// });

// This loop reads the /events/ folder and attaches each event file to the appropriate event.
fs.readdir('./events/', (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    if (file.startsWith('.')) {
      return;
    }
    let eventFunction = require(`./events/${file}`);
    let eventName = file.split('.')[0];
    // super-secret recipe to call events with all their proper arguments *after* the `client` var.
    client.on(eventName, (...args) => eventFunction.run(client, ...args));
  });
});

//Twitch Streamer Notifier
const compare = new Set();
function twitch(message) {
  // List of streamers to get notifications for
  var streamers = ['nullpointer128', 'fitzyhere', 'saamstep'];

  streamers.forEach(function(element) {
    // Allows request to be made

    let options = {
      url: `https://api.twitch.tv/kraken/streams?channel=${element}`,
      method: 'GET',
      headers: {
        'User-Agent': 'D.js-Bot-Dev',
        'Client-ID': `${config.twitchID}`,
        'content-type': 'application/json'
      }
    };
    // Makes request
    request(options, function(error, response, body) {
      body = JSON.parse(body);
      if (body._total < 1) {
        return;
      } else if (!compare.has(element)) {
        // Message formatter for the notificiations
        const embed = {
          description: '**' + body.streams[0].channel.status + '**',
          url: 'http://twitch.tv/' + body.streams[0].channel.display_name,
          color: 6684837,
          footer: {
            icon_url:
              'https://cdn4.iconfinder.com/data/icons/social-media-circle-long-shadow/1024/long-10-512.png',
            text: config.serverName + ' Bot'
          },
          thumbnail: {
            url: body.streams[0].channel.logo
          },
          author: {
            name: body.streams[0].channel.display_name + ' is live',
            url: 'http://twitch.tv/' + body.streams[0].channel.display_name,
            icon_url:
              'https://cdn4.iconfinder.com/data/icons/social-media-circle-long-shadow/1024/long-10-512.png'
          },
          fields: [
            {
              name: 'Game',
              value: body.streams[0].channel.game,
              inline: true
            },
            {
              name: 'Link',
              value: 'http://twitch.tv/' + body.streams[0].channel.display_name,
              inline: true
            }
          ]
        };
        // Add streamer name to a set
        compare.add(element);

        if (compare.has(element)) {
          console.log('Compare has element!');
        }

        // Finds channel and sends msg to channel
        client.guilds.map(guild => {
          if (guild.available) {
            let channel = guild.channels.find(
              channel => channel.name === `${config.twitchChannel}`
            );
            if (channel) {
              channel.send(config.mentionNotify, {
                embed
              });
            }
          }
        });
      } else if (compare.has(element) && body._total < 1) {
        compare.delete(element);
        return;
      }
    });
  });
}

// Starts checking for Twitch channels live on launch
// client.on('ready', ready => {
//   setInterval(twitch, 2000);
// });

// End of Twitch Streamer Notifier

client.on('message', message => {
  // YT video like system

  let urls = ConfigService.config.urls;
  if (urls.some(url => message.content.includes(url)) && !message.author.bot) {
    return message.react(`👍`);
  }

  // Nicknamer

  try {
    if (message.channel.id === ConfigService.config.nickChannelid) {
      if (message.content !== '.iam') {
        message.delete(0);
      }
    }
  } catch (err) {
    return;
  }

  if (
    message.content.includes(`${ConfigService.configmcIP}`) &&
    !message.author.bot
  ) {
    message.react(`✅`);
  }

  let guild = message.guild;

  // Support Channel Code
  async function pMreact() {
    await message.react('☑');
    await message.react('🇽');
  }

  if (
    message.channel.id === `${ConfigService.config.supportChannelid}` &&
    !message.author.bot
  ) {
    const tag = ConfigService.config.supportTags;

    if (tag.some(word => message.content.includes(word))) {
      return pMreact();
    } else {
      return message.delete();
    }
  }

  // Command file manager code

  if (message) if (message.author.bot) return;
  if (!message.content.startsWith(config.prefix)) return;

  let command = message.content.split(' ')[0];
  command = command.slice(config.prefix.length);
  client.config = config;
  let args = message.content.split(' ').slice(1);

  // The list of if/else is replaced with those simple 2 lines:

  // Regular command file manager
  try {
    let commandFile = require(`./commands/${command}.js`);
    commandFile.run(client, message, args);
  } catch (err) {
    if (config.debug === true) {
      console.log(err);
    }
  }

  // Custom command file manager
  try {
    let commandFile = require(`./commands/cc/${command}.js`);
    commandFile.run(client, message, args, set);
  } catch (err) {
    if (config.debug === true) {
      console.log(err);
    } else {
      return;
    }
  }
});
