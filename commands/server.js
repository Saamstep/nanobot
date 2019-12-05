const fetch = require("node-fetch");
const fs = require("fs");
exports.run = async (client, message, args) => {
  const cooldown = require("../index.js");
  async function cmd() {
    var mcIP = args[0] ? args[0] : `${client.ConfigService.config.minecraft.serverIP}:${client.ConfigService.config.minecraft.port}`; // Your MC server IP
    var statusURL = "https://api.mcsrvstat.us/2/" + mcIP;
    try {
      const response = await fetch(statusURL);
      const stats = await response.json();

      // ALL OTHER SERVERS
      if (stats.online) {
        let icon = new Buffer.from(stats.icon.replace("data:image/png;base64,", ""), "base64");
        // let output = stats.hostname.replace('/./g', '-') + '.png';
        // fs.writeFileSync('./icons/' + output, icon);
        const attachment = new client.Discord.Attachment(icon, `${mcIP}.png`);

        const embed = {
          url: "https://mcsrvstat.us/",
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
            url: "https://mcsrvstat.us/",
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
              value: stats.version
            }
          ]
        };
        // console.log(output);
        message.channel.send({ files: [attachment], embed });
      } else {
        client.error("I'm having trouble finding that server, please make sure you typed the IP in correctly!", message);
      }
    } catch (e) {
      console.log(e);
      return client.error("Error getting Minecraft server status.", message);
    }
  }
  // cooldown(message, cmd);

  message.channel.send(client.load + " Minecraft Server Status: `" + args[0] + "`").then(async m => {
    await cmd();
    await m.delete();
  });
};
exports.cmd = {
  enabled: true,
  category: "Games",
  level: 0,
  description: "Get server status for said Minecraft server."
};
