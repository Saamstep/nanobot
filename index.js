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


  ConfigService.config.streamers.forEach(async (element) => {
    // Makes request
    try {
      console.log("Fetching Twitch streams from API.".blue);
      const request = await fetch(`https://api.twitch.tv/kraken/streams?channel=${element}`, {
        headers: {
          'User-Agent': 'D.js-Bot-Dev',
          'Client-ID': `${ConfigService.config.twitchID}`,
          'content-type': 'application/json'
        }
      });
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
              channel => channel.name === `${ConfigService.config.twitchChannel}`
            );
            if (channel) {
              channel.send(config.mentionNotify, {
                embed
              });
              console.log("Found a channel to announce and I announced it!".blue)
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


client.login(ConfigService.config.token);

//twitch notify
client.on('ready', ready => {
  log("Checking for Twitch streams".blue);

  try {
    setInterval(twitch, 180000);
  } catch (e) {
    console.error(e);
  }

});



//cooldown
const talkedRecently = new Set()
module.exports = function cooldown(message, code) {
  const error = require('./modules/errorMod.js');

  if (talkedRecently.has(message.author.id)) {
    return error("Wait 6 seconds before typing this again.", message);
  } else {
    code()

    talkedRecently.add(message.author.id);
    setTimeout(() => {
      talkedRecently.delete(message.author.id);
    }, 6000);
  }

}

client.on('message', message => {


  // YT video like system

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
