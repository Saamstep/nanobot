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

//controls all loop checkers
client.on('ready', ready => {
  fs.readdir('./loops/', (err, files) => {
    if (err) return client.console(err);
    files.forEach(file => {
      let eventFunction = require(`./loops/${file}`);
      let eventName = file.split('.')[0];
      setInterval(() => {
        eventFunction.run(client, owl, youtube, twitch, sendMessage);
      }, eventFunction.time);
      client.console(`Ran ${eventName} loop event`.cyan);
    });
  });
  //runs services once to keep them alive
  fs.readdir('./services/', (err, files) => {
    if (err) return client.console(err);
    files.forEach(file => {
      let eventFunction = require(`./services/${file}`);
      let eventName = file.split('.')[0];
      eventFunction.run(client, owl, youtube, twitch, veriEnmap, sendMessage);
      client.console(`Ran ${eventName} service`.cyan.dim);
    });
  });
});

//===ALL ENMAPS===

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

//OverwatchLeague notifier
const owl = new Enmap({
  name: 'OWL',
  autoFetch: true,
  fetchAll: false
});

// enmap and data storage object for verification system

const veriEnmap = new Enmap({
  name: 'verification',
  autoFetch: true,
  fetchAll: true
});

//YT notifier
const youtube = new Enmap({
  name: 'youtube',
  autoFetch: true,
  fetchAll: false
});

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
          sendMessage(
            `${client.ConfigService.config.channel.log}`,
            `${member.user.id} was updated with all their roles and nicknames after joining.`
          );
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
  if (!message.content.startsWith(ConfigService.config.prefix)) return;
  if (!message.guild || message.author.bot) return;

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
