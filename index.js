const Discord = require('discord.js');
const client = new Discord.Client({ autoReconnect: true });
const bot = new Discord.Client({ autoReconnect: true });
const config = require('./config.json');
client.login(config.token);
const fs = require('fs');
var colors = require('colors');

// client.on("ready", () => {
//   client.user.setPresence({game: {name: "Minecraft", type: 0} }).catch(console.error);
//   console.log(`\n\n[${config.serverName} ] bot is online!`.green)
//   console.log(`\n\nBot successfully running. Keep this window open!\n\n`.red)
//   console.log(`Prefix: ${config.prefix}`.blue);
// });

// This loop reads the /events/ folder and attaches each event file to the appropriate event.
fs.readdir('./events/', (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    let eventFunction = require(`./events/${file}`);
    let eventName = file.split('.')[0];
    // super-secret recipe to call events with all their proper arguments *after* the `client` var.
    client.on(eventName, (...args) => eventFunction.run(client, ...args));
  });
});
// YT Video like system

client.on('message', message => {
  if (message.content.includes(`youtube.com/watch?v=`)) {
    message.react(`👍`);
  }

  if (message.content.includes(`youtu.be`)) {
    message.react(`👍`);
  }
  if (message.content.includes(`${config.mcIP}`) && !message.author.bot) {
    message.react(`✅`);
  }

  if (message) if (message.author.bot) return;
  if (!message.content.startsWith(config.prefix)) return;

  let command = message.content.split(' ')[0];
  command = command.slice(config.prefix.length);
  client.config = config;
  let args = message.content.split(' ').slice(1);
  // The list of if/else is replaced with those simple 2 lines:

  try {
    let commandFile = require(`./commands/${command}.js`);
    commandFile.run(client, message, args);
  } catch (err) {
    if (config.debug === 'on') {
      console.log(err);
    } else {
      return;
    }
  }
});
