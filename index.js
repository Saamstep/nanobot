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

//enmap config (yes we're actually doing it this time)
client.settings = new Enmap({
  name: 'bot_config',
  autoFetch: true,
  fetchAll: true
});
const defaultconfig = {
  prefix: '?',
  debug: true,
  ownerid: '',
  playing: '',
  welcome: {
    enabled: true,
    joinMsg: 'Welcome **USER** to SERVER',
    leaveMsg: 'Goodbye USER',
    channel: 'general'
  },
  roles: {
    mod: 'Mod',
    admin: 'Admin',
    smpMember: 'Members',
    interview: '',
    join: 'Cool People'
  },
  twitch: {
    enabled: false,
    channel: 'announcements',
    streamers: ['samstep']
  },
  owl: {
    enabled: true,
    channel: 'overwatch'
  },
  nicknamer: {
    enabled: false,
    channel: '',
    expression: 'USER (NICK)'
  },
  feedback: {
    enabled: false,
    channel: '',
    categories: ['[Review]', '[ASAP]']
  },
  urlReact: {
    enabled: true,
    urls: ['youtu.be/']
  },
  otherChannel: {
    log: 'logger',
    poll: 'announcements'
  },
  rcon: {
    enabled: false,
    port: '',
    pass: ''
  },
  minecraft: {
    IP: '',
    port: '',
    queryPort: '',
    mcServerConnection: false,
    topicChannel: ''
  },
  mcSMP: {
    serverName: 'Dev Test',
    acceptMessage: 'You were accepted! Congratulations!',
    website: '',
    denyImg:
      'http://images.all-free-download.com/images/graphicthumb/delicious_birthday_cake_creative_vector_577659.jpg'
  },
  youtube: {
    channel: '',
    creators: ['UClOf1XXinvZsy4wKPAkro2A']
  }
};

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
    client.on(eventName, (...message) => eventFunction.run(client, ...message));
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
      client.console(`Started ${eventName} loop event`.cyan);
    });
  });

  //runs services once to keep them alive
  fs.readdir('./services/', (err, files) => {
    if (err) return client.console(err);
    files.forEach(file => {
      let eventFunction = require(`./services/${file}`);
      let eventName = file.split('.')[0];
      eventFunction.run(client, owl, youtube, twitch, veriEnmap, sendMessage);
      client.console(`Started ${eventName} service`.cyan.dim);
    });
  });
});

client.on('guildCreate', guild => {
  client.settings.set(guild.id, defaultconfig);
  client.console(`Created config enmap entry for guild:\n${guild.id}`);
});

//===ALL ENMAPS=== (except conf defaults)

//Twitch Streamer Notifier
const twitch = new Enmap({
  name: 'twitch',
  autoFetch: true,
  fetchAll: true
});

//OverwatchLeague notifier
const owl = new Enmap({
  name: 'OWL',
  autoFetch: true,
  fetchAll: true
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
  fetchAll: true
});

//Custom command
const cc = new Enmap({
  name: 'cc',
  autoFetch: true,
  fetchAll: true
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
            .setNickname(`${member.user.username} (${veriEnmap.get(`${member.user.id}`, 'name')})`, 'Joined server.');
          client.console('Updated user ' + member.user.id);
          sendMessage(
            `${client.settings.get(`${guild.id}`, 'otherChannel.log')}`,
            `<@${member.user.id}> was updated with all their roles and nicknames after joining.`
          );
          veriEnmap.get(`${member.user.id}`, 'roles').forEach(function(choice) {
            let role = guild.roles.find(r => r.name === `${choice}`);
            guild.members.get(member.user.id).addRole(role);
          });
          let hsClass = guild.roles.find(r => r.name === `${veriEnmap.get(member.user.id, 'class')}`);
          guild.members.get(member.user.id).addRole(hsClass);
          member.send(
            `You have been sucessfully verified in the Discord server **${
              guild.name
            }**. If you believe this was an error email us at vchsesports@gmail.com\n\nConfirmation Info:\n\`\`\`Discord: ${
              member.user.username
            }\nEmail: ${veriEnmap.get(member.user.id, 'email')}\`\`\``
          );
          let newchannel = guild.channels.find(ch => ch.name === `${client.ConfigService.config.channel.joinCh}`);
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

//MC to Discord - rcon

// var Rcon = require('rcon');
// var updatedport = Number(client.ConfigService.config.minecraft.rcon.port);
// var conn = new Rcon(
//   `${client.ConfigService.config.minecraft.IP}`,
//   updatedport,
//   `${client.ConfigService.config.minecraft.rcon.pass}`
// );

// conn.on('auth', function() {
//   client.console('RCON | Authed!'.green);
// });
// conn.on('end', function() {
//   client.console('RCON | Socket closed!'.green);
// });

// if (!ConfigService.config.rconPort == '') {
//   conn.connect();
//   client.console('RCON | Connecting to server @ ' + JSON.stringify(conn.host + ':' + conn.port).green);
// } else {
//   client.console('RCON | Disabled!'.green);
// }

client.on('message', message => {
  client.guilds.forEach(function(g) {
    // MC to Discord message handler
    if (message.channel.name === `${client.settings.get(`${g.id}`, 'minecraft.topicChannel')}`) {
      if (message.author.bot) return;
      let msg = `tellraw @a ["",{"text":"<${message.author.username}> ${message.content}","color":"aqua"}]`;
      conn.send(msg);
    }

    // thumbs up url system
    try {
      let urls = client.settings.get(`${g.id}`, 'urlReact.urls');
      if (urls.some(url => message.content.includes(url)) && !message.author.bot) {
        return message.react(`👍`);
      }
    } catch (e) {
      console.error(e);
    }

    // Nicknamer [p]iam command
    try {
      if (message.channel.name === `${client.settings.get(`${g.id}`, 'nicknamer.channel')}`) {
        if (message.content !== `${client.settings.get(`${g.id}`, 'prefix')}iam`) {
          message.delete(0);
        }
      }
    } catch (err) {
      console.error(err);
    }

    // Checkmarks if the correct IP is typed in chat
    if (`${client.settings.get(`${g.id}`, 'minecraft.IP')}` !== '') {
      if (message.content.includes(`${client.settings.get(`${g.id}`, 'minecraft.IP')}`) && !message.author.bot) {
        message.react(`✅`);
      }
    }
    // Support Channel Code
    async function pMreact() {
      await message.react('⬆');
      await message.react('⬇');
    }

    //Support channel code

    if (message.channel.name === `${client.settings.get(`${g.id}`, 'feedback.channel')}` && !message.author.bot) {
      const tag = `${client.settings.get(`${g.id}`, 'feedback.categories')}`;
      if (tag.some(word => message.content.includes(word))) {
        pMreact();
      } else if (client.isAdmin(message.author, message, false, client)) {
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
    if (!message.content.startsWith(client.ConfigService.config.prefix)) return;
    if (!message.guild || message.author.bot) return;

    let command = message.content.split(' ')[0];
    command = command.slice(config.prefix.length);
    client.config = config;
    let args = message.content.split(' ').slice(1);

    // Regular command file manager
    try {
      cc.defer.then(() => {
        if (cc.has(command)) {
          return;
        } else {
          try {
            let commandFile = require(`./commands/${command}.js`);
            commandFile.run(client, message, args, veriEnmap, cc);
          } catch (e) {
            console.error(e);
          }
        }
      });
    } catch (err) {
      if (client.ConfigService.config.debug === true) {
        console.error(err);
      }
    }

    //New Custom Command File System

    // if (message.content.startsWith('?addcc')) {
    //   cc.defer.then(() => {
    //     cc.set(`${args[0]}`, args.join(' ').replace(args[0], ''));
    //   });
    // }

    // if (message.content.startsWith('?listall')) {
    //   cc.defer.then(() => {
    //     return console.log(cc);
    //   });
    // }
    // if (message.content.startsWith('?deleteall')) {
    //   cc.defer.then(() => {
    //     return cc.deleteAll();
    //   });
    // }

    try {
      if (message.content.startsWith(client.settings.get(`${g.id}`, 'prefix')) && cc.has(command)) {
        cc.defer.then(() => {
          message.channel.send(cc.get(command));
        });
      } else {
        return;
      }
    } catch (e) {
      console.error(e);
    }
  });
});
