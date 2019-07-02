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

//Send Message to Channel Function
function sendMessage(name, msg) {
  client.guilds.map(guild => {
    if (guild.available) {
      let channel = guild.channels.find(channel => channel.name === `${name}`);
      if (channel) {
        channel.send(msg);
      }
    }
  });
}

//enmap config (yes we're actually doing it this time)
client.config = new Enmap({
  name: 'bot_config',
  autoFetch: true,
  fetchAll: false
});
const defaultconfig = {
  //add this
};

//Twitch Streamer Notifier
twitch = new Enmap({
  name: 'twitch',
  autoFetch: true,
  fetchAll: false
});

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
        return client.console(`Already announced ${body.blogs[0].blogId}`.yellow);
      } else {
        owl.set('news', body.blogs[0].blogId);
        //it wasn't announced, so we annoucne it with this code
        // Finds channel and sends msg to channel
        const embed = {
          description: `**${body.blogs[0].title}**\n${body.blogs[0].summary}\n\n[Read more](${
            body.blogs[0].defaultUrl
          })`,
          url: `${body.blogs[0].defaultUrl}`,
          color: 16752385,
          timestamp: body.blogs[0].publish,
          footer: {
            text: `Author: ${body.blogs[0].author}`
          },
          image: {
            url: `${body.blogs[0].thumbnail.url.replace('//', 'https://')}`
          },
          author: {
            name: 'OverwatchLeague News',
            url: `${body.blogs[0].defaultUrl}`,
            icon_url:
              'https://static-cdn.jtvnw.net/jtv_user_pictures/8c55fdc6-9b84-4daf-a33b-cb318acbf994-profile_image-300x300.png'
          }
        };
        // client.guilds.map(guild => {
        //   if (guild.available) {
        //     let channel = guild.channels.find(channel => channel.name === `${client.ConfigService.config.channel.owl}`);
        //     if (channel) {

        //       channel.send({ embed });
        //     }
        //   }
        // });
        sendMessage(`${client.ConfigService.config.channel.owl}`, { embed });
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
        return client.console(`Already announced ${body.data.liveMatch.id}`.yellow);
      } else {
        function isEmpty(obj) {
          for (var key in obj) {
            if (obj.hasOwnProperty(key)) return false;
          }
          return true;
        }
        if (isEmpty(body.data.liveMatch)) {
          return client.console('No live match data.');
        }
        owl.set('live', body.data.liveMatch.id);
        //it wasn't announced, so we announce it with this code
        // Finds channel and sends msg to channel
        // client.guilds.map(guild => {
        //   if (guild.available) {
        //     let channel = guild.channels.find(channel => channel.name === `${client.ConfigService.config.channel.owl}`);
        //     if (channel) {
        //       channel.send({ embed });
        //     }
        //   }
        // });

        const embed = {
          description: `${logos(body.data.liveMatch.competitors[0].abbreviatedName)} **${
            body.data.liveMatch.competitors[0].name
          }** vs ${logos(body.data.liveMatch.competitors[1].abbreviatedName)} **${
            body.data.liveMatch.competitors[1].name
          }**`,
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
        sendMessage(`${client.ConfigService.config.channel.owl}`, { embed });
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
      `http://mcapi.us/server/status?ip=${client.ConfigService.config.minecraft.IP}&port=${
        client.ConfigService.config.minecraft.port
      }`
    );

    const body = await response.json();

    if (body.online === false) {
      client.guilds.map(guild => {
        let channel = guild.channels.find(
          channel => channel.name === `${client.ConfigService.config.channel.mcBridge}`
        );
        if (channel) {
          channel.setTopic('Server Offline');
        }
      });
    }
    if (body.online === true) {
      client.guilds.map(guild => {
        let channel = guild.channels.find(channel => channel.name === `mc-channel`);
        if (channel) {
          channel.setTopic(
            `${ConfigService.config.serverName} | ${body.server.name} | ${body.players.now}/${body.players.max} online`
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
  fetchAll: true
});

function sendAuthEmail(email, name, discorduser) {
  //nodemail
  var nodemailer = require('nodemailer');
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: ConfigService.config.mail.user,
      pass: ConfigService.config.mail.pass
    }
  });
    //add discord invite to html
    fs.readFile('./html/confirm.html', 'utf8', function(err, data) {
      if (err) {
        return console.log(err);
      }
      let result = data
        .replace(/NAME/g, name)
        .replace(/DISCORDUSER/g, discorduser);

      var mailOptions = {
        from: 'DiscordBot',
        to: `${email}`,
        subject: 'Discord Server Verification',
        html: `${result}`
      };

      // finally sends the email to the user with the code so they know what it is!
      transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
          client.console(error);
        } else {
          client.console('Email sent: ' + info.response);
          sendMessage(`${client.ConfigService.config.channel.log}`, `Email sent to ${name} (${discorduser}) with the email adress ${email} for server verification.`);
        }
      });
    });
}

function sendErrorEmail(email, name, errormsg) {
  //nodemail
  var nodemailer = require('nodemailer');
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: ConfigService.config.mail.user,
      pass: ConfigService.config.mail.pass
    }
  });

  //add discord invite to html
  fs.readFile('./html/error.html', 'utf8', function(err, data) {
    if (err) {
      return console.log(err);
    }
    let result = data.replace(/NAME/g, name).replace(/ERROR/g, errormsg);

    var mailOptions = {
      from: 'DiscordBot',
      to: `${email}`,
      subject: 'Discord Server Verification',
      html: `${result}`
    };

    // finally sends the email to the user with the code so they know what it is!
    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        client.console(error);
      } else {
        client.console('Email sent: ' + info.response);
      }
    });
  });
}


async function onJoin(member) {
  try {
    //check if DB is ready
    veriEnmap.defer.then(() => {
      let guild = client.guilds.get(`${client.ConfigService.config.guild}`);
      //if the user is not in the guild, do not crash!
      //if the discord id is in db, it means they are verified :D so add roles, nickname etc
      if (veriEnmap.has(`${member.user.id}`)) {
        let addRole = guild.roles.find(r => r.name === `${client.ConfigService.config.roles.iamRole}`);
        //if they dont have default role, run commands
        if (!guild.member(member.user.id).roles.find(r => r.name === `${client.ConfigService.config.roles.iamRole}`)) {
          // add the roles
          guild.members
            .get(member.user.id)
            .addRole(addRole)
            .catch(console.error);
          // set nickname
          guild.members
            .get(member.user.id)
            .setNickname(`${veriEnmap.get(`${member.user.id}`, 'name')}`, 'Joined server.');
          client.console('Updated user ' + member.user.id);
          sendMessage(`${client.ConfigService.config.channel.log}`, `${member.user.id} was updated with all their roles and nicknames after joining.`);
          veriEnmap.get(`${member.user.id}`, 'roles').forEach(function(choice) {
            let role = guild.roles.find(r => r.name === `${choice}`);
            guild.members.get(member.user.id).addRole(role);
          });
          member.send(
            `You have been sucessfully verified in the Discord server **${
              guild.name
            }**. If you believe this was an error email us at vchsesports@gmail.com\n\nConfirmation Info:\n\`\`\`Discord: ${
              member.user.username
            }\nEmail: ${veriEnmap.get(member.user.id, 'email')}\`\`\``
          );
          let newchannel = guild.channels.find(ch => ch.name === `${ConfigService.config.channel.joinCh}`);
          newchannel.send(`✅ **${member.user.username}** has been verified!`);
        }
      } else {
        //if they are not in the database (wonder how they got there) then run the following commands
        member.send(
          `Welcome to **${
            guild.name
          }** requires user verification, please fill out the Google form here: https://forms.gle/qGxEx2Vqd7fcLbzD8. Note that you will be kicked if you do not fill the form out.`
        );
      }
    });

    // });
  } catch (e) {
    console.error(e);
  }
}

client.on('guildMemberAdd', member => {
  onJoin(member);
});

const youtube = new Enmap({
  name: 'youtube',
  autoFetch: true,
  fetchAll: false
});

//YT Video
async function youtubeNotifier() {
  client.ConfigService.config.youtubeChannels.forEach(async function(id) {
    client.console('YouTube | Searching for new videos...');
    const api = await fetch(
      `https://www.googleapis.com/youtube/v3/search?key=${
        client.ConfigService.config.apis.youtube
      }&channelId=${id}&part=snippet,id&order=date&maxResults=1`
    );
    const channel = await api.json();
    if (!youtube.has(channel.items[0].id.videoId)) {
      client.console('YouTube | Found channel video to announce!');
      let youtubeURL = `https://youtu.be/${channel.items[0].id.videoId}`;
      const embed = {
        url: `${youtubeURL}`,
        color: 15076647,
        timestamp: `${channel.items[0].snippet.publishedAt}`,
        footer: {
          text: 'YouTube Notifier'
        },
        image: {
          url: `${channel.items[0].snippet.thumbnails.medium.url}`
        },
        author: {
          name: `${channel.items[0].snippet.channelTitle} Uploaded`,
          url: `${youtubeURL}`,
          icon_url: 'https://seeklogo.com/images/Y/youtube-square-logo-3F9D037665-seeklogo.com.png'
        },
        fields: [
          {
            name: 'Title',
            value: `${channel.items[0].snippet.title}`
          },
          {
            name: 'Video Link',
            value: `${youtubeURL}`
          }
        ]
      };
      // client.guilds.map(guild => {
      //   if (guild.available) {
      //     let channel = guild.channels.find(
      //       channel => channel.name === `${client.ConfigService.config.channel.youtube}`
      //     );
      //     if (channel) {
      //       channel.send({ embed });
      //     }
      //   }
      // });
      sendMessage(`${client.ConfigService.config.channel.youtube}`, { embed });
      if (channel.items) youtube.set(`${channel.items[0].id.videoId}`, true);
    } else {
      client.console(`YouTube | Already announced ${channel.items[0].id.videoId}`);
    }
  });
}

//TypeForm Responses Webhook server
function typeFormServer() {
  const http = require('http');
  var options = {
    key: fs.readFileSync('./https/key.pem'),
    cert: fs.readFileSync('./https/cert.pem'),
    method: 'POST',
    path: '/typeform'
  };
  client.console('HTTP Server | Listening for requests'.red);
  http
    .createServer(options, function(req, res) {
      let body = '';
      req.setEncoding('utf8');
      req.on('data', function(chunk) {
        body += chunk;
      });
      req.on('end', function() {
   
        if (body) {
          client.console('Crypto | Verified');
          let data = JSON.parse(body);
          console.log(data);

          let discorduser = data[2].answer; //discord username
          let discordid = client.users.find(user => user.username + '#' + user.discriminator == `${discorduser}`);
          
          let email = data[1].answer; //email
          let name = data[0].answer; //name
          veriEnmap.defer.then(() => {
              sendAuthEmail(email, name, discorduser);
              client.console(`Auth email sent to ${email}`);
              veriEnmap.defer.then(() => {
                veriEnmap.set(`${discordid.id}`, {
                  name: `${name}`,
                  email: `${email}`,
                  roles: data[3].answer
                });
    
                discordid.send(
                  `You have been sucessfully verified in the Discord server. If you believe this was an error email us at vchsesports@gmail.com\n\nConfirmation Info:\n\`\`\`Discord: ${
                    discorduser}\nEmail: ${veriEnmap.get(discordid.id, 'email')}\`\`\``
                );
                let guild = client.guilds.get(`${client.ConfigService.config.guild}`);
                let join = guild.channels.find(jn => jn.name === `${ConfigService.config.channel.joinCh}`);
                join.send(`✅ **${discordid.username}** has been verified, welcome ${name}.`);
                console.log(`set enmap data\n${name}\n${email}\n${discordid.username}\nwith given username: ${discorduser}`);
                let addRole = guild.roles.find(r => r.name === `${client.ConfigService.config.roles.iamRole}`);
                //if they dont have default role, run commands
                if (!guild.member(discordid.id).roles.find(r => r.name === `${client.ConfigService.config.roles.iamRole}`)) {
                  // add the roles
                  guild.members
                    .get(discordid.id)
                    .addRole(addRole)
                    .catch(console.error);
                  // set nickname
                  guild.members
                    .get(discordid.id)
                    .setNickname(`${veriEnmap.get(`${discordid.id}`, 'name')}`, 'Joined server.');
                  client.console('Updated user: ' + discorduser);
                  veriEnmap.get(discordid.id, 'roles').forEach(function(choice) {
                    let role = guild.roles.find(r => r.name === `${choice}`);
                    guild.members.get(discordid.id).addRole(role);
                  });
                };
              });
          });
          res.end('<h1>Complete</h1>');
        } else {
          client.console('Crypto | Invalid Signature');
          return res.end('<h1>Error</h1>');
        }
      });
    })
    .listen(3000);
}
async function twitchNotifier() {
  // List of streamers to get notifications for
  ConfigService.config.streamers.forEach(async element => {
    // Makes request
    try {
      client.console('Twitch | Getting streamer status: ' + element.magenta.dim);
      const request = await fetch(`https://api.twitch.tv/kraken/streams?channel=${element}`, {
        headers: {
          'User-Agent': 'D.js-Bot-Dev',
          'Client-ID': `${client.ConfigService.config.apis.twitch}`,
          'content-type': 'application/json'
        }
      });
      const body = await request.json();
      if (body._total == 0) {
        return client.console('Twitch | Found ' + element.magenta.dim + ' is not live');
      }
      twitch.defer.then(() => {
        if (!twitch.has(element)) {
          // Message formatter for the notificiations
          const embed = {
            description: '**' + body.streams[0].channel.status + '**',
            url: 'http://twitch.tv/' + body.streams[0].channel.display_name,
            color: 6684837,
            footer: {
              icon_url: 'https://cdn4.iconfinder.com/data/icons/social-media-circle-long-shadow/1024/long-10-512.png',
              text: client.user.username + ' Bot'
            },
            thumbnail: {
              url: body.streams[0].channel.logo
            },
            author: {
              name: body.streams[0].channel.display_name + ' is live',
              url: 'http://twitch.tv/' + body.streams[0].channel.display_name,
              icon_url: 'https://cdn4.iconfinder.com/data/icons/social-media-circle-long-shadow/1024/long-10-512.png'
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
          twitch.set(element, true);
          sendMessage(`${client.ConfigService.config.channel.twitch}`, { embed });
          client.console('Twitch | Found ' + element.magenta.dim + ' is live! Sending the announcement...');
        } else if (twitch.has(element) && body._total < 1) {
          twitch.delete(element);
          return;
        }
      });
      // });
    } catch (e) {
      client.console(e);
    }
  });
}

client.on('ready', ready => {
  typeFormServer();
  try {
    setInterval(() => {
      twitchNotifier();
    }, 180000);
  } catch (e) {
    console.error(e);
  }

  try {
    setInterval(youtubeNotifier, 300000);
  } catch (e) {
    client.console(e);
  }

  // try {
  //   setInterval(checkEmail, 10000);
  // } catch (e) {
  //   client.console(e);
  // }

  try {
    if (client.ConfigService.config.minecraft.discordToMC == true) {
      setInterval(topic, 180000);
    }
  } catch (e) {
    client.console(e);
  }
  setInterval(owlLiveMatch, 280000);
  setInterval(owlNews, 280000);
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
          sendMessage('mc-channel', '<' + username + '> ' + message);
        });
      }
    });

    let port = Number(client.ConfigService.config.minecraft.webPort);
    const host = client.ConfigService.config.minecraft.webhost;

    server.listen(port, host);
    client.console(`MC --> Discord | Listening at http://${host}:${port}`.green);
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
  client.console('RCON | Connecting to server @ ' + JSON.stringify(conn.host + ':' + conn.port).green);
} else {
  client.console('RCON | Disabled!'.green);
}

client.on('message', message => {
  // let guild = client.guilds.get(`${client.ConfigService.config.guild}`);
  // let adminPerm = guild.roles.find(r => r.name === `${client.ConfigService.config.roles.adminrolename}`)
//   if(message.member.roles.has(adminPerm.id)) {
//  if (message.content.startsWith('!cleardata_nocancel')) {
//     veriEnmap.defer.then(() => {
//       veriEnmap.deleteAll();
//       message.channel.send('Cleared verification enmap');
//     });
// }
// 
// if(message.content.startsWith(`${client.ConfigService.config.prefix}addrole`)) {

//   let part = message.content.split(' ').slice(1);
//   if(!part[0] && part[1]) {
//     return 
//   }
//   let member = message.mentions.users.first();
//   veriEnmap.push(`${member.id}`, `${part[1]}`, 'roles')
// }

// if(message.content.startsWith(`${client.ConfigService.config.prefix}removerole`)) {
  
//   let part = message.content.split(' ').slice(1);
//   if(!part[0] && part[1]) {
//     return 
//   }

//   let member = message.mentions.users.first();
//   veriEnmap.remove(`${member.id}`, `${part[1]}`, 'roles')
// }

// if(message.content.startsWith(`${client.ConfigService.config.prefix}updatename`)) {
  
//   let part = message.content.split(' ').slice(1);
//   if(!part[0] && part[1]) {
//     return 
//   }

// let member = message.mentions.users.first();
// veriEnmap.set(`${member.id}`, 'name', `${part[0]} ${part[1]}`)
// member.setNickname(`${part[0]} ${part[1]}`);
// }

//   } else {
//     return;
//   }

   // if (message.content.startsWith(`${client.ConfigService.config.prefix}data`)) {
  //   veriEnmap.defer.then(() => {
  //     if (!args[0]) {
  //       const embed = {
  //         color: 16239504,
  //         author: {
  //           name: `${message.author.username}'s Data`,
  //           avatar_url: `${message.author.avatarURL}`
  //         },
  //         fields: [
  //           {
  //             name: 'Name',
  //             value: `${veriEnmap.get(`${message.author.id}`, 'name')}`
  //           },
  //           {
  //             name: 'Discord',
  //             value: `${message.author.username}#${message.author.discriminator}`
  //           },
  //           {
  //             name: 'Email',
  //             value: `${veriEnmap.get(`${message.author.id}`, 'email')}`
  //           },
  //           {
  //             name: 'Roles',
  //             value: `${veriEnmap.get(`${message.author.id}`, 'roles').join('\n')}`
  //           }
  //         ]
  //       };
  //       message.author.send({ embed });
  //     } else {
  //       var member = message.mentions.users.first();
  //       const embed = {
  //         color: 16239504,
  //         author: {
  //           name: `${member.username}'s Data`,
  //           avatar_url: `${member.avatarURL}`
  //         },
  //         fields: [
  //           {
  //             name: 'Name',
  //             value: `${veriEnmap.get(`${member.id}`, 'name')}`
  //           },
  //           {
  //             name: 'Discord',
  //             value: `<@${member.id}>`
  //           },
  //           {
  //             name: 'Email',
  //             value: `${veriEnmap.get(`${member.id}`, 'email')}`
  //           },
  //           {
  //             name: 'Roles',
  //             value: `${veriEnmap.get(`${member.id}`, 'roles').join('\n')}`
  //           }
  //         ]
  //       };
  //       if (client.isMod(message.author, message)) return message.author.send({ embed });
  //     }
  //   });
  // }

  //MC Bridge
  if (message.channel.id === `${client.ConfigService.config.channel.mcBridge}`) {
    if (message.author.bot) return;
    let msg = `tellraw @a ["",{"text":"<${message.author.username}> ${message.content}","color":"aqua"}]`;
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
    if (message.content.includes(`${client.ConfigService.config.minecraft.IP}`) && !message.author.bot) {
      message.react(`✅`);
    }
  }
  // Support Channel Code
  async function pMreact() {
    await message.react('⬆');
    await message.react('⬇');
  }

  //support channel code

  if (message.channel.id === `${client.ConfigService.config.channel.supportID}` && !message.author.bot) {
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
          msg.author.send('Your suggestion `' + msg.content + '` was removed by an admin for: ```' + reason + '```');
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
    commandFile.run(client, message, args, veriEnmap);
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
