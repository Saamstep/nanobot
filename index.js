const Discord = require("discord.js");
const client = new Discord.Client();
const bot = new Discord.Client();
const config = require("./config.json");
client.login(config.token);
const fs = require("fs");
var colors = require('colors');


client.on("ready", () => {
  client.user.setPresence({game: {name: "Minecraft", type: 0} }).catch(console.error);
  console.log(`\n\n${config.serverName}'s bot is online!`.green)
  console.log(`\n\nBot successfully running. Keep this window open!\n\n`.red)
  console.log(`Prefix: ${config.prefix}`.blue);
});


// This loop reads the /events/ folder and attaches each event file to the appropriate event.
fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    let eventFunction = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    // super-secret recipe to call events with all their proper arguments *after* the `client` var.
    client.on(eventName, (...args) => eventFunction.run(client, ...args));

  });
});
// YT Video like system
client.on("message", message => {
  if (message.content.includes(`youtube.com/watch?v=`))
  {
    message.react(`👍`);
  }

  if (message.content.includes(`youtu.be`))
  {
    message.react(`👍`);
  }
  if (message.content.includes(`nanosmp.us.to:25560`))
  {
    message.react(`✅`);
  }

  if (message)

    if (message.author.bot) return;
  if (!message.content.startsWith(config.prefix)) return;

  let command = message.content.split(" ")[0];
  command = command.slice(config.prefix.length);

  let args = message.content.split(" ").slice(1);
  // The list of if/else is replaced with those simple 2 lines:

  try {
    let commandFile = require(`./commands/${command}.js`);
    commandFile.run(client, message, args);
  } catch (err) {
    // console.error(err);
    // console.log("hi");
    console.log(err);
  }
});

/*
client.elevation = message => {
  /* This function should resolve to an ELEVATION level which
     is then sent to the command handler for verification
  let permlvl = 0;
  const mod_role = message.guild.roles.find('name', config.modrolename);
  if (mod_role && message.member.roles.has(mod_role.id)) permlvl = 2;
  const admin_role = message.guild.roles.find('name', config.adminrolename);
  if (admin_role && message.member.roles.has(admin_role.id)) permlvl = 3;
  if (message.author.id === config.ownerid) permlvl = 4;
  return permlvl;
};
*/


client.on("guildMemberAdd", member => {
  const channel = member.guild.channels.find("name", "general");
  if (!channel) return;
  // Send the message, mentioning the member
  channel.send(`Welcome to the server **${member}**`);
});

client.on("guildMemberRemove", member => {
  let gchannel = member.guild.channels.find("name", "general");
  gchannel.send(` **${member}** left the server`);
});


client.on("guildBanAdd",(guild, user) => {
  let logchannel = guild.channels.find("name", "log");
  logchannel.send('', {embed: {
    color: 44242,
    author: {
      name: "A user was banned!"
    },
    title: '\nUsername:',
    description: `${user.username}`,
    timestamp: new Date(),
    footer: {
      text: 'Logged by honeydewbot'
    }
  }
  });
});

client.on('guildBanRemove',(guild, user) => {
  let logchannel = guild.channels.find("name", "log");
  logchannel.send('', {embed: {
    color: 44242,
    author: {
      name: "A user was banned!"
    },
    title: '\nUsername:',
    description: `${user.username}`,
    timestamp: new Date(),
    footer: {
      text: 'Logged by honeydewbot'
    }
  }
  });
});
