const Discord = require('discord.js');
const client = new Discord.Client({ autoReconnect: true });
const ConfigService = require('./config.js');
const fs = require('fs');
const fetch = require('node-fetch');
const Enmap = require('enmap');

//modules init.
client.isAdmin = require('./modules/isAdmin.js');
client.isMod = require('./modules/isMod.js');
client.isOwner = require('./modules/isOwner.js');
client.error = require('./modules/errorMod.js');
client.console = require('./modules/consoleMod.js');
client.log = require('./modules/logMod.js');
client.ConfigService = require('./config.js');
client.login(ConfigService.config.token);

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
                channel.name === `${client.ConfigService.config.channel.twitch}`
            );
            if (channel) {
              channel.send(client.ConfigService.config.twitchMentionNotify, {
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

const owl = new Enmap({
  name: 'OWL',
  autoFetch: true,
  fetchAll: false
});

//OWL Team Logos
function logos(output) {
  const emoji = client.emojis.find(emoji => emoji.name === `${output}`);
  return emoji;
}

//OWL News
async function owlNews() {
  client.console('OWL | Checking for OWL news...'.yellow);

  //we use try incase the api doesn't exist and the bot crashes :P
  try {
    //fetch news from official API
    const response = await fetch('https://api.overwatchleague.com/news');
    const body = await response.json();
    //check to see if we already announced the lastest article
    owl.defer.then(() => {
      if (owl.get('news') === body.blogs[0].blogId) {
        //if announced, skip it (:
        return client.console(
          `Already announced ${body.blogs[0].blogId}`.yellow
        );
      } else {
        owl.set('news', body.blogs[0].blogId);
        //it wasn't announced, so we annoucne it with this code
        // Finds channel and sends msg to channel
        client.guilds.map(guild => {
          if (guild.available) {
            let channel = guild.channels.find(
              channel =>
                channel.name === `${client.ConfigService.config.channel.owl}`
            );
            if (channel) {
              const embed = {
                description: `**${body.blogs[0].title}**\n${
                  body.blogs[0].summary
                }\n\n[Read more](${body.blogs[0].defaultUrl})`,
                url: `${body.blogs[0].defaultUrl}`,
                color: 16752385,
                timestamp: body.blogs[0].publish,
                footer: {
                  text: `Author: ${body.blogs[0].author}`
                },
                image: {
                  url: `${body.blogs[0].thumbnail.url.replace(
                    '//',
                    'https://'
                  )}`
                },
                author: {
                  name: 'OverwatchLeague News',
                  url: `${body.blogs[0].defaultUrl}`,
                  icon_url:
                    'https://static-cdn.jtvnw.net/jtv_user_pictures/8c55fdc6-9b84-4daf-a33b-cb318acbf994-profile_image-300x300.png'
                }
              };
              channel.send({ embed });
            }
          }
        });
      }
    });
  } catch (e) {
    client.console(e);
  }
}

//OWL Live-Match
async function owlLiveMatch() {
  client.console('OWL | Checking for OWL live match...'.yellow);

  //we use try incase the api doesn't exist and the bot crashes :P
  try {
    //fetch news from official API
    const response = await fetch('https://api.overwatchleague.com/live-match');
    const body = await response.json();
    //check to see if we already announced the lastest article
    owl.defer.then(() => {
      if (owl.get('live') === body.data.liveMatch.id) {
        //if announced, skip it (:
        return client.console(
          `Already announced ${body.data.liveMatch.id}`.yellow
        );
      } else {
        owl.set('live', body.data.liveMatch.id);
        //it wasn't announced, so we announce it with this code
        // Finds channel and sends msg to channel
        client.guilds.map(guild => {
          if (guild.available) {
            let channel = guild.channels.find(
              channel =>
                channel.name === `${client.ConfigService.config.channel.owl}`
            );
            if (channel) {
              const embed = {
                description: `${logos(
                  body.data.liveMatch.competitors[0].abbreviatedName
                )} **${body.data.liveMatch.competitors[0].name}** vs ${logos(
                  body.data.liveMatch.competitors[1].abbreviatedName
                )} **${body.data.liveMatch.competitors[1].name}**`,
                url: `https://twitch.tv/overwatchleague`,
                color: 16752385,
                fields: [
                  {
                    name: 'Date & Time',
                    value: `${new Date(body.data.liveMatch.startDate)}`
                  }
                ],
                author: {
                  name: 'OverwatchLeague Live',
                  icon_url:
                    'https://static-cdn.jtvnw.net/jtv_user_pictures/8c55fdc6-9b84-4daf-a33b-cb318acbf994-profile_image-300x300.png'
                }
              };
              channel.send({ embed });
            }
          }
        });
      }
    });
  } catch (e) {
    client.console(e);
  }
}

// mc channel topic:
async function topic() {
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

// enmap and data storage object

const veriEnmap = new Enmap({
  name: 'verification',
  autoFetch: true,
  fetchAll: false
});

//typeform lookup

//detect if user is in guild.
async function typeForm() {
  try {
    const response = await fetch(
      'https://api.typeform.com/forms/IotT2f/responses',
      {
        headers: {
          Authorization: `Bearer ${client.ConfigService.config.apis.typeform}`
        }
      }
    ).catch(error => console.error(error));
    const data = await response.json();
    data.items.forEach(function(element) {
      let guild = client.guilds.get('519603949431554048');
      if (!element.answers) {
      } else {
        let user = client.users.find(
          user =>
            user.username + '#' + user.discriminator ==
            `${element.answers[3].text}`
        );
        veriEnmap.defer.then(() => {
          if (veriEnmap.has(user.id)) {
            return console.log(
              `${
                user.username
              } was attempted to be linked again. We ignored it since it already is linked.`
            );
          } else {
            if (!element.answers[1].email.includes('@warriorlife.net')) {
              return console.log(
                'Non warriorlife email detected!' + element.answers[1].email
              );
            }
            veriEnmap.set(`${user.id}`, {
              name: `${element.answers[0].text}`,
              email: `${element.answers[1].email}`
            });
            user.send(
              `Your Discord account was used to link to **${
                guild.name
              }**. If you believe this was an error email us at vchsesports@gmail.com\nDiscord: ${
                user.username
              }\nEmail: ${element.answers[1].email}`
            );
            // let member = client.fetchUser(`${user.id}`);
            guild.members
              .get(user.id)
              .setNickname(`${element.answers[0].text}`);
            let addRole = guild.roles.find(
              'name',
              `${client.ConfigService.config.roles.iamRole}`
            );
            guild.members.get(user.id).addRole(addRole);
          }
          if (veriEnmap.has(user.id) && ' ') {
            //give back roles if left
          }
        });
      }
    });
  } catch (e) {
    console.error(e);
  }
}

client.on('ready', ready => {
  try {
    setInterval(twitch, 180000);
  } catch (e) {
    client.console(e);
  }
  typeForm();
  try {
    if (client.ConfigService.config.minecraft.discordToMC == true) {
      setInterval(topic, 180000);
    }
  } catch (e) {
    client.console(e);
  }
  setInterval(owlLiveMatch, 180000);
  setInterval(owlNews, 179999);
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
  if (message.content.startsWith('!data')) {
    veriEnmap.defer.then(() => {
      message.author.send(
        '```json\n' +
          JSON.stringify(veriEnmap.get(`${message.author.id}`), null, 4) +
          '```'
      );
    });
  }

  if (message.content.startsWith('!cleardata')) {
    veriEnmap.defer.then(() => {
      veriEnmap.deleteAll();
      message.channel.send('```json\n' + '{ "cleared": "true", }' + '```');
    });
  }

  if (message.content.startsWith('!alldata')) {
    veriEnmap.defer.then(() => {
      message.channel.send(veriEnmap.fetchEverything());
    });
  }

  if (message.content.startsWith('!emailchecker')) {
    veriEnmap.defer.then(() => {
      if (veriEnmap.has(`${message.author.id}`)) {
        message.channel.send(`${message.author.id} found in Database.`);
      }
    });
  }

  //Verification System (Email Code)

  //check if veriifcation channel is used
  // if (message.channel.id == client.ConfigService.config.channel.nickID) {
  //   veriEnmap.defer.then(() => {
  //     if (!message.content.includes('@warriorlife.net'))
  //       return message.author.send('Please use a valid VCHS student email.');
  //     if (veriEnmap.get(`${message.author.id}`, 'email') === message.content)
  //       return message.author.send(
  //         'This email has already been used to be verified. If you believe this is an error please direct message an Administrator.'
  //       );
  //   });

  // function sendAuthEmail() {
  //   var nodemailer = require('nodemailer');
  //   let testAccount = nodemailer.createTestAccount();
  //   var transporter = nodemailer.createTransport({
  //     service: 'gmail',
  //     auth: {
  //       user: '',
  //       pass: ''
  //     }
  //   });

  //   //generates our random string to verify users
  //   var chars =
  //     '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
  //   var string_length = 8;
  //   var randomstring = '';
  //   for (var i = 0; i < string_length; i++) {
  //     var rnum = Math.floor(Math.random() * chars.length);
  //     randomstring += chars.substring(rnum, rnum + 1);
  //   }
  //   //message and info sent in email
  //   var mailOptions = {
  //     from: 'DiscordBot',
  //     to: `${message.content}`,
  //     subject: 'Discord Server Verification',
  //     text: `Here is your unique verification code, paste this into the Discord channel to gain access. ${randomstring}`
  //   };
  //   // checks if db is ready then writes to it data from new user
  //   veriEnmap.defer.then(() => {
  //     veriEnmap.set(`${message.author.id}`, {
  //       name: `${message.author.tag}`, //figure out how this is achieved
  //       email: `${message.content}`,
  //       code: `${randomstring}`
  //     });
  //   });
  //   // finally sends the email to the user with the code so they know what it is!
  //   transporter.sendMail(mailOptions, function(error, info) {
  //     if (error) {
  //       console.log(error);
  //     } else {
  //       client.console(JSON.stringify(veriEnmap.get(`${message.author.id}`)));
  //       console.log('Email sent: ' + info.response);
  //     }
  //   });
  // }

  // ADD DM to remind users to verify on join
  // }

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
    commandFile.run(client, message, args);
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
