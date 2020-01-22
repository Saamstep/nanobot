exports.run = (client, message, args) => {
  // async function cmd() {
  const fs = require("fs");

  // const arrays = {
  //   fun: [],
  //   utility: [],
  //   moderation: [],
  //   mcsmp: [],
  //   esports: [],
  //   admin: [],
  //   games: []
  // };
  let cmds = [];

  let commands = fs.readdirSync("./commands/");

  // files.forEach(file => {
  let mod = client.isMod(message.author, message, client);
  let ad = client.isAdmin(message.author, message, false, client);

  function getCmds(category) {
    commands.forEach(function(file) {
      if (file == ".DS_Store" || !file.includes(".js")) return;
      //command name
      let name = file.split(".")[0];
      let data = require(`../commands/${file}`).cmd;
      if (!data) return client.console(`No cmd object for ${file}`, "error", "help command");
      //description
      let val = data.enabled ? data.description : "*" + data.description;
      let template = `> ${client.ConfigService.config.prefix}${name}\n‣\`${val}\`\n`;
      if (data.category == category) {
        cmds.push(template);
      }
      // switch (data.category) {
      //   case "Fun":
      //     arrays.fun.push(template);
      //     break;
      //   case "Utility":
      //     arrays.utility.push(template);
      //     break;
      //   case "Moderation":
      //     if (!mod) return;
      //     arrays.moderation.push(template);
      //     break;
      //   case "MinecraftSMP":
      //     arrays.mcsmp.push(template);
      //     break;
      //   case "VCHS Esports":
      //     arrays.esports.push(template);
      //     break;
      //   case "Admin":
      //     if (!ad) return;
      //     arrays.admin.push(template);
      //     break;
      //   case "Games":
      //     arrays.games.push(template);
      //     break;
      //   default:
      //     return;
      // }
    });
    let embed = {
      description: cmds.join(""),
      author: {
        name: category + " Commands"
      },
      footer: {
        text: `${client.user.username}`
      }
    };

    return { embed };

    // Object.keys(arrays).forEach(arr => {
    //   if (arr == "moderation" && !mod) return;
    //   if (arr == "admin" && !ad) return;
    //   let embed = {
    //     description: arrays[arr].join(""),
    //     author: {
    //       name: arr + " commands"
    //     },
    //     footer: {
    //       text: `${client.user.username}`
    //     }
    //   };
    //   setTimeout(function() {
    //     message.author.send({ embed });
    //   }, 1000);
    //   // setTimeoutmessage.channel.send(arrays[arr]);
    // });
  }

  // message.channel.stopTyping();
  let out = "Fun: 🚀\nUtility: 🔗\nMinecraft SMP: ⛏️\nGames: 🎲\nVCHS Esports: 🖱️";
  if (ad) out += `\nAdmin: 🔒`;
  if (mod) out += `\nModeration: 🛡️`;
  message.author.send(out).then(async msg => {
    await msg.react("🚀");
    await msg.react("🔗");
    await msg.react("⛏️");
    await msg.react("🎲");
    await msg.react("🖱️");
    if (ad) await msg.react("🔒");
    if (mod) await msg.react("🛡️");
    function toUpdate() {
      const filter = (reaction, user) => user.id === message.author.id;
      msg
        .awaitReactions(filter, { max: 1, time: 15000 })
        .then(collected => {
          const reaction = collected.first();
          switch (reaction.emoji.name) {
            case "🛡️":
              msg.edit(getCmds("Moderation"));
              break;
            case "🚀":
              msg.edit(getCmds("Fun"));
              break;
            case "🔗":
              msg.edit(getCmds("Utility"));
              break;
            case "⛏️":
              msg.edit(getCmds("Minecraft SMP"));
              break;
            case "🎲":
              msg.edit(getCmds("Games"));
              break;
            case "🔒":
              msg.edit(getCmds("Admin"));
              break;
            case "🖱️":
              msg.edit(getCmds("VCHS Esports"));
              break;
          }
          msg.reactions.forEach(reaction => reaction.remove(reaction.user));
        })
        .catch(console.error);
    }
    toUpdate();
  });

  // cooldown(message, cmd);
};

exports.cmd = {
  enabled: true,
  category: "Utility",
  level: 0,
  description: "Get info about all the commands"
};
