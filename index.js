const Discord = require('discord.js');
const client = new Discord.Client({ autoReconnect: true });
const ConfigService = require('./config.js');
const fs = require('fs');
const log = require('./modules/consoleMod.js');
const logger = require('./modules/logMod.js');
const fetch = require('node-fetch');

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
async function twitch(message) {
  // List of streamers to get notifications for

  ConfigService.config.streamers.forEach(async element => {
    // Makes request
    try {
      console.log('Fetching Twitch streams from API.'.blue);
      const request = await fetch(
        `https://api.twitch.tv/kraken/streams?channel=${element}`,
        {
          headers: {
            'User-Agent': 'D.js-Bot-Dev',
            'Client-ID': `${ConfigService.config.twitchID}`,
            'content-type': 'application/json'
          }
        }
      );
      const body = await request.json();
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

        // Finds channel and sends msg to channel
        client.guilds.map(guild => {
          if (guild.available) {
            let channel = guild.channels.find(
              channel =>
                channel.name === `${ConfigService.config.twitchChannel}`
            );
            if (channel) {
              channel.send(config.mentionNotify, {
                embed
              });
              console.log(
                'Found a channel to announce and I announced it!'.blue
              );
            }
          }
        });
      } else if (compare.has(element) && body._total < 1) {
        compare.delete(element);
        return;
      }
    } catch (e) {
      console.warn(e);
      return;
    }
  });
}

// // enmap settings
// const Enmap = require('enmap');
// client.settings = new Enmap({
//   name: 'settings',
//   fetchAll: false,
//   autoFetch: true,
//   cloneLevel: 'deep'
// });

// const settings = {
//   debug: false,
//   prefix: '?',
//   roles: {
//     mod: '_Mod',
//     admin: '_Admin',
//     member: '_Member',
//     interview: '',
//     iam: ''
//   },
//   channel: {
//     log: 'logger',
//     qotd: '',
//     join: '',
//     support: '',
//     iam: ''
//   },
//   mc: {
//     serverName: '',
//     acceptMessage: 'You were accepted! Congratulations!',
//     denyMessage: '',
//     website: '',
//     ip: '',
//     port: ''
//   },
//   msg: {
//     join: '',
//     leave: ''
//   },
//   reactPrompts: ['youtu.be'],
//   supportTags: ['[Addition]', '[Request]', '[Removal]'],
//   streamers: ['firstupdatesnow', 'emongg', 'nullpointer128']
// };

// end bot configuration

client.login(ConfigService.config.token);

async function topic() {
  // mc channel topic:
  const fetch = require('node-fetch');
  try {
    const response = await fetch(
      `http://mcapi.us/server/status?ip=${ConfigService.config.mcIP}&port=${
        ConfigService.config.mcPort
      }`
    );

    const body = await response.json();

    if (body.online === false) {
      client.guilds.map(guild => {
        let channel = guild.channels.find(
          channel => channel.name === `mc-channel`
        );
        if (channel) {
          channel.setTopic('Server Offline');
        }
      });
    }
    if (body.online === true) {
      client.guilds.map(guild => {
        let channel = guild.channels.find(
          channel => channel.name === `mc-channel`
        );
        if (channel) {
          channel.setTopic(
            `${ConfigService.config.serverName} | ${body.server.name} | ${
              body.players.now
            }/${body.players.max} online`
          );
          console.log('Set topic!');
        }
      });
    }
  } catch (e) {
    console.error(e);
  }
}

//twitch notify
client.on('ready', ready => {
  log('Checking for Twitch streams'.blue);

  try {
    setInterval(twitch, 180000);
  } catch (e) {
    console.error(e);
  }

  setInterval(topic, 300000);
});

//cooldown
const talkedRecently = new Set();
module.exports = function cooldown(message, code) {
  const error = require('./modules/errorMod.js');

  if (talkedRecently.has(message.author.id)) {
    return error('Wait 6 seconds before typing this again.', message);
  } else {
    code();

    talkedRecently.add(message.author.id);
    setTimeout(() => {
      talkedRecently.delete(message.author.id);
    }, 6000);
  }
};

// mc to discord

const http = require('http');

const regex = new RegExp('\\[Server thread/INFO\\]: <([^>]*)> (.*)');

const server = http.createServer(function(request, response) {
  console.dir(request.param);

  if (request.method == 'POST') {
    var body = '';
    request.on('data', function(data) {
      body += data;
    });
    request.on('end', function() {
      const regBody = body.match(regex);
      const username = regBody[1].replace(/(§[A-Z-a-z0-9])/g, '');
      const message = regBody[2];
      response.writeHead(200, { 'Content-Type': 'text/html' });
      response.end(username + ': ' + message);
      client.guilds.map(guild => {
        if (guild.available) {
          let channel = guild.channels.find(
            channel => channel.name === `mc-channel`
          );
          if (channel) {
            channel.send('<' + username + '> ' + message);
          }
        }
      });
    });
  }
});

let port = Number(ConfigService.config.mcwebPort);
const host = ConfigService.config.mcwebhost;
// server.listen(port, host);
console.log(`MC --> Discord | Listening at http://${host}:${port}`);

// end of mc to discord

//mc
var Rcon = require('rcon');
var updatedport = Number(ConfigService.config.rconPort);
var conn = new Rcon(
  `${ConfigService.config.mcIP}`,
  updatedport,
  `${ConfigService.config.rconPass}`
);

conn.on('auth', function() {
  console.log('Authed!');
});
conn.on('end', function() {
  console.log('Socket closed!');
});

conn.connect();

client.on('message', message => {
  // YT video like system
  if (message.channel.id === `${ConfigService.config.mcChannel}`) {
    if (message.author.bot) return;
    let msg = `tellraw @a ["",{"text":"<${message.author.username}> ${
      message.content
    }","color":"aqua"}]`;
    conn.send(msg);
  }

  //end mc

  let urls = ConfigService.config.urls;
  if (urls.some(url => message.content.includes(url)) && !message.author.bot) {
    return message.react(`👍`);
  }

  // Nicknamer

  try {
    if (message.channel.id === ConfigService.config.nickChannelid) {
      if (message.content !== `${ConfigService.config.prefix}iam`) {
        message.delete(0);
      }
    }
  } catch (err) {
    return;
  }

  if (
    message.content.includes(`${ConfigService.config.mcIP}`) &&
    !message.author.bot
  ) {
    message.react(`✅`);
  }

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
  if (!message.guild || message.author.bot) return;
  if (!message.content.includes(ConfigService.config.prefix)) return;

  let command = message.content.split(' ')[0];
  command = command.slice(config.prefix.length);
  client.config = config;
  let args = message.content.split(' ').slice(1);

  // Regular command file manager
  try {
    let commandFile = require(`./commands/${command}.js`);
    commandFile.run(client, message, args, conn);
    message.channel.stopTyping(true);
  } catch (err) {
    if (config.debug === true) {
      console.warn(err);
    }
  }

  // Custom command file manager
  try {
    let commandFile = require(`./commands/cc/${command}.js`);
    commandFile.run(client, message, args);
  } catch (err) {
    if (config.debug === true) {
      console.warn(err);
    } else {
      return;
    }
  }
});
