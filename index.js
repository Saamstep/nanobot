const Discord = require("discord.js");
const client = new Discord.Client({ autoReconnect: true });
const fs = require("fs");
const fetch = require("node-fetch");
const schedule = require("node-schedule");
const Enmap = require("enmap");
// require("./dashboard/index.js");
//modules init.
client.Discord = require("discord.js");
client.isAdmin = require("./modules/isAdmin.js");
client.isMod = require("./modules/isMod.js");
client.isOwner = require("./modules/isOwner.js");
client.error = require("./modules/errorMod.js");
client.console = require("./modules/consoleMod.js");
client.log = require("./modules/logMod.js");
client.ConfigService = require("./config.js");
client.login(client.ConfigService.config.token);
client.load = client.emojis.find(emoji => emoji.name === "NANOloading");

// This loop reads the /events/ folder and attaches each event file to the appropriate event.
fs.readdir("./events/", (err, files) => {
  if (err) return client.console(err, "warn", "Events Loop");
  files.forEach(file => {
    if (file.startsWith(".")) {
      return;
    }
    let eventFunction = require(`./events/${file}`);
    let eventName = file.split(".")[0];
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
client.on("ready", ready => {
  fs.readdir("./loops/", (err, files) => {
    if (err) return client.console(err, "warn", "Events Loop");
    files.forEach(file => {
      if (!file.includes("js")) return;
      let eventFunction = require(`./loops/${file}`);
      let eventName = file.split(".")[0];
      if (client.ConfigService.config.loops[eventName] == true) {
        setInterval(() => {
          eventFunction.run(client, dupe, sendMessage);
        }, eventFunction.time);
        client.console(`${eventName}: Started `.cyan, "info", "Loops");
      } else {
        client.console(`${eventName}: Disabled `.cyan.dim, "info", "Loops");
      }
    });
  });

  //runs services once to keep them alive
  fs.readdir("./services/", (err, files) => {
    if (err) return client.console(err, "warn", "Services");
    files.forEach(file => {
      if (!file.includes("js")) return;
      let eventFunction = require(`./services/${file}`);
      let eventName = file.split(".")[0];
      if (client.ConfigService.config.services[eventName] == true) {
        eventFunction.run(client, dupe, sendMessage);
        client.console(`${eventName}: Started`.cyan, "info", "Services");
      } else {
        client.console(`${eventName}: Disabled`.cyan.dim, "info", "Services");
      }
    });
  });

  if (client.ConfigService.config.smp.rcon.autoRestart) {
    setInterval(() => {
      require("./services/rcon.js").run(client);
    }, 300000);
  }

  if (client.ConfigService.config.services.joinSys) {
    schedule.scheduleJob("0 */12 * * *", function() {
      let guild = client.guilds.get(client.ConfigService.config.guild);
      let noRoleMembers = guild.members.filter(member => !member.roles.has(guild.roles.find(r => r.name == `${client.ConfigService.config.roles.iamRole}`).id));
      noRoleMembers.forEach(member => member.send("**VCHS Esports Discord** Please verify yourself! Verification allows you to get access to all channels within our Discord server and interact with the community!\nhttp://discord.vchsesports.net"));
    });
  }
});

//===ALL ENMAPS DECLARED===

//Dupe Check for Twitch/OWL/YT
const dupe = new Enmap({
  name: "dupeCheck",
  autoFetch: true,
  fetchAll: true
});

// enmap and data storage object for verification system

// const veriEnmap = new Enmap({
//   name: "verification",
//   autoFetch: true,
//   fetchAll: true
// });

client.profiles = new Enmap({
  name: "profiles",
  autoFetch: true,
  fetchAll: true
});

//Custom command
const cc = new Enmap({
  name: "cc",
  autoFetch: true,
  fetchAll: true
});
client.ccSize = cc.size;

//role react system start -------------
const events = {
  MESSAGE_REACTION_ADD: "messageReactionAdd",
  MESSAGE_REACTION_REMOVE: "messageReactionRemove"
};
client.on("raw", async event => {
  if (!events.hasOwnProperty(event.t)) return;
  const { d: data } = event;
  if (data.emoji.name == "🗑️" && event.t == "MESSAGE_REACTION_ADD" && !client.users.get(data.user_id).bot) {
    client.channels
      .get(data.channel_id)
      .fetchMessage(data.message_id)
      .then(msg => {
        if (msg.author.id == client.user.id) {
          msg.delete();
        }
      });
  }
  if (data.message_id != client.ConfigService.config.roleReact.message) return;
  if (client.ConfigService.config.roleReact.emojis.includes(event.d.emoji.id)) {
    //user that reacted
    let user = client.users.get(data.user_id);
    const channel = client.channels.get(data.channel_id);
    if (channel.messages.has(data.message_id)) return;
    const message = await channel.fetchMessage(data.message_id);

    const emojiKey = data.emoji.id ? `${data.emoji.name}:${data.emoji.id}` : data.emoji.name;
    const reaction = message.reactions.get(emojiKey);
    client.emit(events[event.t], reaction, user);
  }
});

client.on("messageReactionAdd", (reaction, user) => {
  if (user.bot) return;
  if (client.ConfigService.config.roleReact.emojis.indexOf(reaction.emoji.id) == -1) return;
  let roleName = client.ConfigService.config.roleReact.roles[client.ConfigService.config.roleReact.emojis.indexOf(reaction.emoji.id)];
  let role = client.guilds.get(reaction.emoji.guild.id).roles.find(r => r.name == roleName);
  let member = reaction.message.guild.members.find(m => m.id == user.id);
  member.send(`You were given the role **${roleName}**`);
  // veriEnmap.push(`${member.id}`, `${roleName}`, "roles");
  member.addRole(role.id);
});

client.on("messageReactionRemove", (reaction, user) => {
  if (user.bot) return;
  if (client.ConfigService.config.roleReact.emojis.indexOf(reaction.emoji.id) == -1) return;
  let roleName = client.ConfigService.config.roleReact.roles[client.ConfigService.config.roleReact.emojis.indexOf(reaction.emoji.id)];
  let role = client.guilds.get(reaction.emoji.guild.id).roles.find(r => r.name == roleName);
  let member = reaction.message.guild.members.find(m => m.id == user.id);
  member.send(`Removed **${roleName}** from you`);
  // veriEnmap.remove(`${member.id}`, `${roleName}`, "roles");
  member.removeRole(role.id);
});
// role react system end -------------

//username update
client.on("userUpdate", (oldUser, newUser) => {
  if (oldUser.username != newUser.username) {
    // try {
    //   veriEnmap.defer.then(() => {
    //     let guild = client.guilds.get(`${client.ConfigService.config.guild}`);
    //     let u = guild.members.get(newUser.id);
    //     u.setNickname(`${newUser.username} (${veriEnmap.get(`${newUser.id}`, "name")})`);
    //     const embed = {
    //       color: 16075062,
    //       timestamp: Date.now(),
    //       footer: {
    //         icon_url: client.user.avatarURL,
    //         text: `${client.user.username} Verification`
    //       },
    //       author: {
    //         name: "Username Updated"
    //       },
    //       fields: [
    //         {
    //           name: "Old",
    //           value: oldUser.username,
    //           inline: true
    //         },
    //         {
    //           name: "New",
    //           value: newUser.username,
    //           inline: true
    //         }
    //       ]
    //     };
    //     sendMessage(client.ConfigService.config.channel.log, { embed });
    //   });
    // } catch (e) {
    //   return;
    // }
  } else {
    return;
  }
});

//verification remember system
client.on("guildMemberAdd", member => {
  if (member.guild.id == client.ConfigService.config.guild && client.ConfigService.config.services.joinSys == true) {
    let sheets = require("./src/sheetsRejoin.js");
    sheets.run(client, sendMessage, member);
  } else {
    return;
  }
});

//cooldown
const talkedRecently = new Set();
module.exports = function cooldown(message, code) {
  const error = require("./modules/errorMod.js");

  if (talkedRecently.has(message.author.id)) {
    return error("Wait 5 seconds before typing this again.", message);
  } else {
    code();

    talkedRecently.add(message.author.id);
    setTimeout(() => {
      talkedRecently.delete(message.author.id);
    }, 5000);
  }
};

client.on("message", message => {
  //links in general
  let link = /(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gim;
  if (message.channel.id == "476921107778109442" && link.test(message.content) && !client.isMod(message.author, message, client, false)) {
    message.delete(0);
    message.channel.send("No links allowed here! Please use <#498912077499334712>").then(m => {
      m.delete(4000);
    });
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

  // Support Channel Code
  async function pMreact() {
    await message.react("⬆");
    await message.react("⬇");
  }

  if (message.channel.id == `${client.ConfigService.config.channel.supportID}` && !message.author.bot) {
    const tag = client.ConfigService.config.supportTags;
    let manager = message.guild.roles.find(r => r.name == "Community Manager");
    if (tag.some(word => message.content.startsWith(word))) {
      pMreact();
    } else if (client.isAdmin(message.author, message, false, client) || message.member.roles.has(manager.id)) {
      if (message.content.startsWith("check")) {
        let args = message.content.split(" ").slice(1);
        message.channel.fetchMessage(args[0]).then(msg => {
          msg.react("✅");
        });
        message.delete(0);
      }
      if (message.content.startsWith("delete")) {
        let args = message.content.split(" ").slice(1);
        let reason = args.join(" ");
        reason = reason.replace(args[0], "\n");
        message.delete(0);
        message.channel.fetchMessage(args[0]).then(msg => {
          msg.delete(0);
          msg.author.send("Your suggestion `" + msg.content + "` was removed by an admin for: ```" + reason + "```");
        });
      }
    } else {
      message.delete();
    }
  }

  // Command file manager code
  if (!message.content.startsWith(client.ConfigService.config.prefix)) return;
  if (!message.guild || message.author.bot) return;

  let command = message.content.split(" ")[0];
  command = command.slice(config.prefix.length);
  client.config = config;
  let args = message.content.split(" ").slice(1);

  // Regular command file manager
  try {
    cc.defer.then(() => {
      if (cc.has(command)) {
        return;
      } else {
        try {
          let commandFile = require(`./commands/${command}.js`);
          if (!commandFile.cmd.enabled) return client.error("This command is disabled", message);
          /*
          ==Levels==
          0 - @everyone
          1 - Mod
          2 - Admin
          3 - Owner only
          */
          function run() {
            commandFile.run(client, message, args, cc);
          }

          switch (commandFile.cmd.level) {
            case 0:
              run();
              break;
            case 1:
              if (client.isMod(message.author, message, client)) {
                run();
              }
              break;
            case 2:
              if (client.isAdmin(message.author, message, true, client)) {
                run();
              }
              break;
            case 3:
              if (client.isOwner(message, true, client)) {
                run();
              }
              break;
            default:
              client.error("There seems to be an error with permissions... This isn't good. Make sure your Admin, Mod and Owner fields have been inputted correctly.", message);
          }
        } catch (e) {
          console.error(e);
        }
      }
    });
  } catch (err) {
    if (client.ConfigService.config.debug == true) {
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
