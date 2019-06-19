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
      if (!compare.has(element)) {
        // Message formatter for the notificiations
        const embed = {
          description: '**' + body.streams[0].channel.status + '**',
          url: 'http://twitch.tv/' + body.streams[0].channel.display_name,
          color: 6684837,
          footer: {
            icon_url: 'https://cdn4.iconfinder.com/data/icons/social-media-circle-long-shadow/1024/long-10-512.png',
            text: config.serverName + ' Bot'
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
        compare.add(element);

        // Finds channel and sends msg to channel
        client.guilds.map(guild => {
          if (guild.available) {
            let channel = guild.channels.find(
              channel => channel.name === `${client.ConfigService.config.channel.twitch}`
            );
            if (channel) {
              channel.send(client.ConfigService.config.twitchMentionNotify, {
                embed
              });
              client.console('Twitch | Found ' + element.magenta.dim + ' is live! Sending the announcement...');
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
        return client.console(`Already announced ${body.blogs[0].blogId}`.yellow);
      } else {
        owl.set('news', body.blogs[0].blogId);
        //it wasn't announced, so we annoucne it with this code
        // Finds channel and sends msg to channel
        client.guilds.map(guild => {
          if (guild.available) {
            let channel = guild.channels.find(channel => channel.name === `${client.ConfigService.config.channel.owl}`);
            if (channel) {
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
        return client.console(`Already announced ${body.data.liveMatch.id}`.yellow);
      } else {
        owl.set('live', body.data.liveMatch.id);
        //it wasn't announced, so we announce it with this code
        // Finds channel and sends msg to channel
        client.guilds.map(guild => {
          if (guild.available) {
            let channel = guild.channels.find(channel => channel.name === `${client.ConfigService.config.channel.owl}`);
            if (channel) {
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
  fetchAll: false
});
const mailMap = new Enmap({
  name: 'mailchecker',
  autoFetch: true,
  fetchAll: false
});

function sendAuthEmail(email) {
  //nodemail
  var nodemailer = require('nodemailer');
  let testAccount = nodemailer.createTestAccount();
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: ConfigService.config.mail.user,
      pass: ConfigService.config.mail.pass
    }
  });
  async function invite() {
    let guild = client.guilds.get(`${client.ConfigService.config.guild}`);

    let channel = guild.channels.find('name', `${client.ConfigService.config.channel.joinCh}`);
    let options = {
      maxUses: '1',
      unique: true
    };
    let invite = await channel.createInvite(options, `Inviting ${email} to server.`).catch(console.error);
    let code = `https://discord.gg/${invite.code}`;

    let html = fs.readFile('./html/email.html', function(err, data) {
      // let sendHTML = data.replace('DISCORDCODE', code);
      //message and info sent in email
      var mailOptions = {
        from: 'DiscordBot',
        to: `${email}`,
        subject: 'Discord Server Verification',
        html: `<!doctype html>
        <html>
          <head>
            <meta name="viewport" content="width=device-width">
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
            <title>Simple Transactional Email</title>
            <style>
            /* -------------------------------------
                INLINED WITH htmlemail.io/inline
            ------------------------------------- */
            /* -------------------------------------
                RESPONSIVE AND MOBILE FRIENDLY STYLES
            ------------------------------------- */
            @media only screen and (max-width: 620px) {
              table[class=body] h1 {
                font-size: 28px !important;
                margin-bottom: 10px !important;
              }
              table[class=body] p,
                    table[class=body] ul,
                    table[class=body] ol,
                    table[class=body] td,
                    table[class=body] span,
                    table[class=body] a {
                font-size: 16px !important;
              }
              table[class=body] .wrapper,
                    table[class=body] .article {
                padding: 10px !important;
              }
              table[class=body] .content {
                padding: 0 !important;
              }
              table[class=body] .container {
                padding: 0 !important;
                width: 100% !important;
              }
              table[class=body] .main {
                border-left-width: 0 !important;
                border-radius: 0 !important;
                border-right-width: 0 !important;
              }
              table[class=body] .btn table {
                width: 100% !important;
              }
              table[class=body] .btn a {
                width: 100% !important;
              }
              table[class=body] .img-responsive {
                height: auto !important;
                max-width: 100% !important;
                width: auto !important;
              }
            }
        
            /* -------------------------------------
                PRESERVE THESE STYLES IN THE HEAD
            ------------------------------------- */
            @media all {
              .ExternalClass {
                width: 100%;
              }
              .ExternalClass,
                    .ExternalClass p,
                    .ExternalClass span,
                    .ExternalClass font,
                    .ExternalClass td,
                    .ExternalClass div {
                line-height: 100%;
              }
              .apple-link a {
                color: inherit !important;
                font-family: inherit !important;
                font-size: inherit !important;
                font-weight: inherit !important;
                line-height: inherit !important;
                text-decoration: none !important;
              }
              .btn-primary table td:hover {
                background-color: #34495e !important;
              }
              .btn-primary a:hover {
                background-color: #34495e !important;
                border-color: #34495e !important;
              }
            }
            </style>
          </head>
          <body class="" style="background-color: #f6f6f6; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;">
            <table border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background-color: #f6f6f6;">
              <tr>
                <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td>
                <td class="container" style="font-family: sans-serif; font-size: 14px; vertical-align: top; display: block; Margin: 0 auto; max-width: 580px; padding: 10px; width: 580px;">
                  <div class="content" style="box-sizing: border-box; display: block; Margin: 0 auto; max-width: 580px; padding: 10px;">
        
                    <!-- START CENTERED WHITE CONTAINER -->
                    <span class="preheader" style="color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;">Discord Server Verification.</span>
                    <table class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background: #ffffff; border-radius: 3px;">
        
                      <!-- START MAIN CONTENT AREA -->
                      <tr>
                        <td class="wrapper" style="font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;">
                          <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
                            <tr>
                                <img src="https://i.imgur.com/gxaWyAa.png" height="60"></tr>
                              <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">
                                <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Hello there,</p>
                                <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">This email is your invite to the Digital Experience Discord server. This is a Valley Chrisitan student only Discord.</p>
                                <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Incase you forgot our Discord ToS here it is for you:</p>
                                <p> As the Valley Christian High School Esports Hub, I , will not invite NON-Valley Christian High School students to the Discord server. I , understand that in this Discord server, I must follow all the rules below.
                                  <br>
                                  <br>
                                  Rules:
                                  <br>
                                  1) No swearing/inappropriate language<br>
                                  2) No toxicity towards other teammates, teams, HSEL, and/or HSEL teams<br>
                                  3) Keep channel content related to channel topics<br>
                                  4) Do not spam/flood channels<br>
                                  5) Follow the Discord Terms of Service <a href=https://discordapp.com/tos>https://discordapp.com/tos</a><br>
                                  6) As a Valley Christian Student, be respectful and a proper role model for everyone in the server<br>
                                  7) Listen to all Management/Leadership<br>
                                  8) Be respectful to everyone<br>
                                  9) Act civil in voice channels<br>
                                  10) Use music bots and all other bots appropriately, do not play inappropriate music.<br>
                                  11) I understand that if I do not follow these rules I may be punished in a way deemed acceptable by management/leadership.<br>
                                </p>
                                <table border="0" cellpadding="0" cellspacing="0" class="btn btn-primary" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; box-sizing: border-box;">
                                  <tbody>
                                    <tr>
                                      <td align="left" style="font-family: sans-serif; font-size: 14px; vertical-align: top; padding-bottom: 15px;">
                                        <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: auto;">
                                          <tbody>
                                            <tr>
                                              <td style="font-family: sans-serif; font-size: 14px; vertical-align: top; background-color: #3498db; border-radius: 5px; text-align: center;"> <a href="${code}" target="_blank" style="display: inline-block; color: #ffffff; background-color: #3498db; border: solid 1px #3498db; border-radius: 5px; box-sizing: border-box; cursor: pointer; text-decoration: none; font-size: 14px; font-weight: bold; margin: 0; padding: 12px 25px; text-transform: capitalize; border-color: #3498db;">Join Server</a> </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                        <a style="color: #999999; font-size: 10px; text-align: center;">Alternatively click or copy this link: ${code}</a>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
        
                    <!-- END MAIN CONTENT AREA -->
                    </table>
        
                    <!-- START FOOTER -->
                    <div class="footer" style="clear: both; Margin-top: 10px; text-align: center; width: 100%;">
                      <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
                        <tr>
                          <td class="content-block" style="font-family: sans-serif; vertical-align: top; padding-bottom: 10px; padding-top: 10px; font-size: 12px; color: #999999; text-align: center;">
                            <span class="apple-link" style="color: #999999; font-size: 12px; text-align: center;">VCHS Esports<br>Digital Experience</span>
                          </td>
                        </tr>
                        <tr>
                        </tr>
                      </table>
                    </div>
                    <!-- END FOOTER -->
        
                  <!-- END CENTERED WHITE CONTAINER -->
                  </div>
                </td>
                <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td>
              </tr>
            </table>
          </body>
        </html>
        `
      };

      // finally sends the email to the user with the code so they know what it is!
      transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    });
  }
  invite();
}

//checks if email has been sent
async function checkEmail() {
  try {
    const response = await fetch('https://api.typeform.com/forms/IotT2f/responses', {
      headers: {
        Authorization: `Bearer ${client.ConfigService.config.apis.typeform}`
      }
    }).catch(error => console.error(error));
    const data = await response.json();
    data.items.forEach(function(element) {
      //only run for forms with answers
      if (element.answers) {
        //checks db to see if message was sent
        if (!mailMap.has(element.response_id)) {
          //if not sent, send email to approved email only
          if (element.answers[1].email.includes('@warriorlife.net')) {
            sendAuthEmail(element.answers[1].email);
          } else {
            console.log('Email is not a warriorlife.net email!');
          }
          //add response id to set so it does not dupe
          mailMap.set(element.response_id, true);
        } else {
          return console.log('Already exists!');
        }
      }
    });
  } catch (e) {
    console.error(e);
  }
}

//typeform lookup
async function typeForm() {
  try {
    const response = await fetch('https://api.typeform.com/forms/IotT2f/responses', {
      headers: {
        Authorization: `Bearer ${client.ConfigService.config.apis.typeform}`
      }
    }).catch(error => console.error(error));
    const data = await response.json();
    data.items.forEach(function(element) {
      //checks for all responses
      let guild = client.guilds.get(`${client.ConfigService.config.guild}`);
      //only run for form data with answers
      if (element.answers) {
        //find user in guild by searching with username from form
        let user = client.users.find(user => user.username + '#' + user.discriminator == `${element.answers[3].text}`);
        //check if DB is ready
        veriEnmap.defer.then(() => {
          //if the user is not in the guild, do not crash!
          if (!guild.member(user.id)) {
            return console.log(`${user.username} is not in guild yet`);
          }
          //if the discord username was already linked do not link again!
          if (veriEnmap.has(user.id)) {
            let addRole = guild.roles.find('name', `${client.ConfigService.config.roles.iamRole}`);
            if (!guild.member(user.id).roles.find(r => r.name === `${client.ConfigService.config.roles.iamRole}`)) {
              //find role to add to new user

              //set nickname and add the role back
              guild.members
                .get(user.id)
                .addRole(addRole)
                .catch(console.error);
              guild.members.get(user.id).setNickname(`${element.answers[0].text}`, 'Joined server.');
              console.log('Updated user ' + user.id);
            }
            return console.log(`${user.username} is already linked.`);
          } else {
            //if the email ain't approved. don't continue!
            if (!element.answers[1].email.includes('@warriorlife.net')) {
              return console.log('Non warriorlife email detected!' + element.answers[1].email);
            }
          }
          //add user data to set
          veriEnmap.set(`${user.id}`, {
            name: `${element.answers[0].text}`,
            email: `${element.answers[1].email}`
          });
          //send DM to user to confirm they have been linked
          user.send(
            `Your Discord account and email was used to link to **${
              guild.name
            }**. If you believe this was an error email us at vchsesports@gmail.com\nDiscord: ${
              user.username
            }\nEmail: ${element.answers[1].email}`
          );
          guild.members
            .get(user.id)
            .addRole(addRole)
            .catch(console.error);
          guild.members.get(user.id).setNickname(`${element.answers[0].text}`, 'Joined server.');
          console.log('Updated user ' + user.id);
        });
      }
    });
  } catch (e) {
    console.error(e);
  }
}

client.on('guildMemberAdd', member => {
  typeForm();
});

client.on('ready', ready => {
  try {
    setInterval(twitch, 180000);
  } catch (e) {
    client.console(e);
  }

  try {
    setInterval(checkEmail, 10000);
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
              let channel = guild.channels.find(channel => channel.name === `mc-channel`);
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
  if (message.content.startsWith(`${client.ConfigService.config.prefix}data`)) {
    veriEnmap.defer.then(() => {
      message.author.send('```json\n' + JSON.stringify(veriEnmap.get(`${message.author.id}`), null, 4) + '```');
    });
  }

  if (message.content.startsWith(`${client.ConfigService.config.prefix}cleardata`)) {
    veriEnmap.defer.then(() => {
      veriEnmap.deleteAll();
      message.channel.send('Cleared verification enmap');
    });
    mailMap.defer.then(() => {
      mailMap.deleteAll();
      message.channel.send('Cleared mailauth enmap');
    });
  }

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
