const Discord = require('discord.js');
const client = new Discord.Client({ autoReconnect: true });
const ConfigService = require('./config.js');
const fs = require('fs');
const fetch = require('node-fetch');

//modules init.
client.isAdmin = require('./modules/isAdmin.js');
client.isMod = require('./modules/isMod.js');
client.isOwner = require('./modules/isOwner.js');
client.error = require('./modules/errorMod.js');
client.console = require('./modules/consoleMod.js');
client.log = require('./modules/logMod.js');
client.ConfigService = require('./config.js');

// This loop reads the /events/ folder and attaches each event file to the appropriate event.
fs.readdir('./events/', (err, files) => {
  if (err) return client.console(err);
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
      client.console(
        'Twitch | Getting streamer status: ' + element.magenta.dim
      );
      const request = await fetch(
        `https://api.twitch.tv/kraken/streams?channel=${element}`,
        {
          headers: {
            'User-Agent': 'D.js-Bot-Dev',
            'Client-ID': `${client.ConfigService.config.apis.twitch}`,
            'content-type': 'application/json'
          }
        }
      );
      const body = await request.json();
      if (body._total == 0) {
        return client.console(
          'Twitch | Found ' + element.magenta.dim + ' is not live'
        );
      }
      if (!compare.has(element)) {
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
              client.console(
                'Twitch | Found ' +
                  element.magenta.dim +
                  ' is live! Sending the announcement...'
              );
            }
          }
        });
      } else if (compare.has(element) && body._total < 1) {
        compare.delete(element);
        return;
      }
    } catch (e) {
      client.console(e);
      return;
    }
  });
}

client.login(ConfigService.config.token);

async function topic() {
  // mc channel topic:
  const fetch = require('node-fetch');
  try {
    const response = await fetch(
      `http://mcapi.us/server/status?ip=${
        client.ConfigService.config.minecraft.IP
      }&port=${client.ConfigService.config.minecraft.port}`
    );

    const body = await response.json();

    if (body.online === false) {
      client.guilds.map(guild => {
        let channel = guild.channels.find(
          channel =>
            channel.name === `${client.ConfigService.config.channel.mcBridge}`
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
          client.console('MC --> Discord | Set topic!');
        }
      });
    }
  } catch (e) {
    client.console(e);
  }
}

//twitch notify
client.on('ready', ready => {
  try {
    setInterval(twitch, 180000);
  } catch (e) {
    client.console(e);
  }

  try {
    if (client.ConfigService.config.minecraft.discordToMC == true) {
      setInterval(topic, 180000);
    }
  } catch (e) {
    client.console(e);
  }
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
if (client.ConfigService.config.minecraft.discordToMC == true) {
  try {
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

    let port = Number(client.ConfigService.config.minecraft.webPort);
    const host = client.ConfigService.config.minecraft.webhost;

    server.listen(port, host);
    client.console(
      `MC --> Discord | Listening at http://${host}:${port}`.green
    );
  } catch (error) {
    client.console(`MC --> Discord | Disabled! ${error}`.green);
  }
} else {
  client.console(`MC --> Discord | Disabled!`.green);
}

// end of mc to discord

//mc rcon
var Rcon = require('rcon');
var updatedport = Number(client.ConfigService.config.minecraft.rcon.port);
var conn = new Rcon(
  `${client.ConfigService.config.minecraft.IP}`,
  updatedport,
  `${client.ConfigService.config.minecraft.rcon.pass}`
);

conn.on('auth', function() {
  client.console('RCON | Authed!'.green);
});
conn.on('end', function() {
  client.console('RCON | Socket closed!'.green);
});

if (!ConfigService.config.rconPort == '') {
  conn.connect();
  client.console(
    'RCON | Connecting to server @ ' +
      JSON.stringify(conn.host + ':' + conn.port).green
  );
} else {
  client.console('RCON | Disabled!'.green);
}

client.on('message', message => {
  client.on('typingStart', ready => {
    if (client.user) {
      message.channel.stopTyping(true);
    }
  });

  //MC Bridge
  if (
    message.channel.id === `${client.ConfigService.config.channel.mcBridge}`
  ) {
    if (message.author.bot) return;
    let msg = `tellraw @a ["",{"text":"<${message.author.username}> ${
      message.content
    }","color":"aqua"}]`;
    conn.send(msg);
  }

  // ModMail System
  if (message.channel.type == 'dm' && !message.author.bot) {
    const embed = {
      description: `${message.content}`,
      color: 11929975,
      timestamp: Date.now(),
      footer: {
        icon_url: client.user.avatarURL,
        text: client.ConfigService.config.minecraft.serverName
      },
      thumbnail: {
        url: 'http://icon-park.com/imagefiles/paper_plane_navy_blue.png'
      },
      author: {
        name: `ModMail: ${message.author.tag}`,
        icon_url: `${message.author.avatarURL}`
      }
    };
    // >> For now these values need to be modified manually :(
    let guild = client.guilds.get('519603949431554048');
    if (guild) {
      let channel = guild.channels.get(`519604414151917569`);
      channel.send({ embed });
    }
  }

  // thumbs up url system
  let urls = ConfigService.config.urls;
  if (urls.some(url => message.content.includes(url)) && !message.author.bot) {
    return message.react(`👍`);
  }

  // Nicknamer

  try {
    if (message.channel.id === client.ConfigService.config.channel.nickID) {
      if (message.content !== `${ConfigService.config.prefix}iam`) {
        message.delete(0);
      }
    }
  } catch (err) {
    console.error(err);
  }

  // mc ip thumbs up system
  if (client.ConfigService.config.mcIP !== '') {
    if (
      message.content.includes(`${client.ConfigService.config.minecraft.IP}`) &&
      !message.author.bot
    ) {
      message.react(`✅`);
    }
  }
  // Support Channel Code
  async function pMreact() {
    await message.react('⬆');
    await message.react('⬇');
  }

  //support channel code

  if (
    message.channel.id === `${client.ConfigService.config.channel.supportID}` &&
    !message.author.bot
  ) {
    const tag = client.ConfigService.config.supportTags;
    if (tag.some(word => message.content.includes(word))) {
      pMreact();
    } else if (isAdmin(message.author, message, false)) {
      if (message.content.startsWith('check')) {
        let args = message.content.split(' ').slice(1);
        message.channel.fetchMessage(args[0]).then(msg => {
          msg.react('✅');
        });
        message.delete(0);
      }
      if (message.content.startsWith('delete')) {
        let args = message.content.split(' ').slice(1);
        let reason = args.join(' ');
        reason = reason.replace(args[0], '\n');
        message.delete(0);
        message.channel.fetchMessage(args[0]).then(msg => {
          msg.delete(0);
          msg.author.send(
            'Your suggestion `' +
              msg.content +
              '` was removed by an admin for: ```' +
              reason +
              '```'
          );
        });
      }
    } else {
      message.delete();
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
      console.error(err);
    }
  }

  // Custom command file manager
  try {
    let commandFile = require(`./commands/cc/${command}.js`);
    commandFile.run(client, message, args);
  } catch (err) {
    if (config.debug === true) {
      console.error(err);
    } else {
      return;
    }
  }
});
