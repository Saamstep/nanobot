exports.run = (client, message, args, veriEnmap, cc) => {
  if (client.ConfigService.config.smp.ip == "" || !client.ConfigService.config.smp.ip.includes(".")) {
    return client.error("IP not specified `smp.ip` is empty or invalid!");
  }

  switch (args[0]) {
    case "status":
      const fetch = require("node-fetch");
      async function cmd() {
        var statusURL = `https://api.mcsrvstat.us/2/${client.ConfigService.config.smp.ip}`;
        try {
          const response = await fetch(statusURL);
          const stats = await response.json();
          // ALL SERVERS
          if (stats.online) {
            console.log(stats);
            let icon = stats.icon ? new Buffer.from(stats.icon.replace("data:image/png;base64,", ""), "base64") : "https://samstep.net/bots/assets/grass_block.png";
            // let output = stats.hostname.replace('/./g', '-') + '.png';
            // fs.writeFileSync('.+/icons/' + output, icon);
            const attachment = new client.Discord.Attachment(icon, `${client.ConfigService.config.smp.ip}.png`);
            let modded = stats.mods ? " Modded" : " " + stats.software;
            const embed = {
              url: `https://mcsrvstat.us/server/${client.ConfigService.config.smp.ip}`,
              color: 10276707,
              timestamp: Date.now(),
              footer: {
                icon_url: client.user.avatarURL,
                text: "Server Status"
              },
              thumbnail: {
                url: "attachment://" + attachment.file.name
              },
              author: {
                name: args[0],
                url: `https://mcsrvstat.us/server/${client.ConfigService.config.smp.ip}`,
                icon_url: "http://samstep.net/bots/assets/grass_block.png"
              },
              fields: [
                {
                  name: "Online",
                  value: stats.players.online + "/" + stats.players.max
                },
                {
                  name: "MOTD",
                  value: stats.motd.clean.join(" ")
                },
                {
                  name: "Version",
                  value: stats.version + modded
                }
              ]
            };

            message.channel.send({ files: [attachment], embed });
          } else {
            client.error("I'm having trouble finding the server, it may be offline.", message);
          }
        } catch (e) {
          console.log(e);
          return client.error("Error getting Minecraft server status.", message);
        }
      }

      message.channel.send(client.load + " Loading Minecraft SMP Status`" + args[0] + "` ").then(async m => {
        await cmd();
        await m.delete();
      });
      break;
    case "cmd":
      if (client.isAdmin(message.author, message, true, client)) {
        if (Object.values(client.ConfigService.config.smp.rcon)[0] == "" || Object.values(client.ConfigService.config.smp.rcon)[1] == null) {
          return client.error("There is no rcon username and/or port in the config file.", message);
        }
        client.rcon.send(args.join(" ").substring(4, args.join(" ").length));
        break;
      }
    case "restartrcon":
      if (client.isAdmin(message.author, message, true, client)) {
        const rconsrc = require("../services/rcon.js");
        rconsrc.run(client);
        message.channel.send("Attempting to restart rcon...");
      }
      break;
    default:
      message.channel.send({
        embed: {
          title: `IP: ${client.ConfigService.config.smp.ip}`,
          thumbnail: {
            url: `${client.ConfigService.config.smp.iconURL || "https://samstep.net/bots/assets/grass_block.png"}`
          },
          description: `${client.ConfigService.config.smp.description || "Edit this description in the config file!"}`,
          fields: [
            {
              name: "Avaliable Sub-Commands",
              value: "status\ncmd\nrestartrcon"
            }
          ]
        }
      });
      break;
  }
};

exports.cmd = {
  enabled: true,
  category: "Games",
  level: 0,
  description: "Minecraft SMP info and RCON control if avaliable!"
};
