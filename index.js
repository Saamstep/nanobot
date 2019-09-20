const Discord = require('discord.js');
const client = new Discord.Client({ autoReconnect: true });
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
client.login(client.ConfigService.config.token);

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
        eventFunction.run(client, dupe, sendMessage);
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
      eventFunction.run(client, dupe, veriEnmap, sendMessage);
      client.console(`Started ${eventName} service`.cyan.dim);
    });
  });
});

//===ALL ENMAPS DECLARED===

//Dupe Check for Twitch/OWL/YT
const dupe = new Enmap({
  name: 'dupeCheck',
  autoFetch: true,
  fetchAll: true
});
// enmap and data storage object for verification system

const veriEnmap = new Enmap({
  name: 'verification',
  autoFetch: true,
  fetchAll: true
});

//Custom command
const cc = new Enmap({
  name: 'cc',
  autoFetch: true,
  fetchAll: true
});

client.ccSize = cc.size;

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
            `${client.ConfigService.config.channel.log}`,
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
          newchannel.send(`✅ **${member.user.username}** has been verified, welcome back!`);
        }
      } else {
        //if they are not in the database (wonder how they got there) then run the following commands
        member.send(
          `Welcome to **${guild.name}**, we require user verification, please fill out the Google form here: https://forms.gle/8YyJqV3Nnd7VJyYPA. Note that you will be kicked if you do not fill the form out.`
        );
      }
    });

    // });
  } catch (e) {
    console.error(e);
  }
}

client.on('userUpdate', (oldUser, newUser) => {
  sendMessage(client.ConfigService.config.channel.log, `Updated ${oldUser.username}'s nickname to ${newUser.username}`);
  if (oldUser.username != newUser.username) {
    try {
      veriEnmap.defer.then(() => {
        if (veriEnmap.exists(`${newUser.id}`, 'name')) {
          let guild = client.guilds.get(`${client.ConfigService.config.guild}`);
          let u = guild.fetchMember(newUser);
          u.setNickname(`${newUser.username} (${veriEnmap.get(`${newUser.id}`, 'name')})`);
        } else {
          return newUser.send(
            `This is a reminder to verify yourself in the **VCHS Esports** Official Discord! Please check the #join channel for furthur instructions.`
          );
        }
      });
    } catch (e) {
      return;
    }
  } else {
    return;
  }
});

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

client.on('message', message => {
  // MC to Discord message handler (deprecating for now)
  // if (message.channel.name === `${client.settings.get(`${g.id}`, 'minecraft.topicChannel')}`) {
  //   if (message.author.bot) return;
  //   let msg = `tellraw @a ["",{"text":"<${message.author.username}> ${message.content}","color":"aqua"}]`;
  //   conn.send(msg);
  // }

  // thumbs up url system
  try {
    let urls = client.ConfigService.config.urls;
    if (urls.some(url => message.content.includes(url)) && !message.author.bot) {
      return message.react(`👍`);
    }
  } catch (e) {
    console.error(e);
  }

  // Nicknamer [p]iam command
  try {
    if (message.channel.name === `${client.ConfigService.config.channel.nickID}`) {
      if (message.content !== `${client.ConfigService.config.prefix}iam`) {
        message.delete(0);
      }
    }
  } catch (err) {
    console.error(err);
  }

  // Checkmarks if the correct IP is typed in chat
  if (`${client.ConfigService.config.minecraft.serverIP}` !== '') {
    if (message.content.includes(`${client.ConfigService.config.minecraft.IP}`) && !message.author.bot) {
      message.react(`✅`);
    }
  }
  // Support Channel Code
  async function pMreact() {
    await message.react('⬆');
    await message.react('⬇');
  }

  //Support channel code

  if (message.channel.id == `${client.ConfigService.config.channel.supportID}` && !message.author.bot) {
    const tag = client.ConfigService.config.supportTags;
    let manager = message.guild.roles.find(r => r.name == 'Community Manager');
    if (tag.some(word => message.content.startsWith(word))) {
      pMreact();
    } else if (client.isAdmin(message.author, message, false, client) || message.member.roles.has(manager.id)) {
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
  try {
    if (message.content.startsWith(client.ConfigService.config.prefix) && cc.has(command)) {
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
