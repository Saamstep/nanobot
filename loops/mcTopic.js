exports.run = (client, dupe, sendMessage) => {
  const fetch = require("node-fetch");
  // mc channel topic:
  async function topic() {
    try {
      const response = await fetch(`http://mcapi.us/server/status?ip=${client.ConfigService.config.minecraft.IP}&port=${client.ConfigService.config.minecraft.port}`);

      const body = await response.json();

      if (body.online === false) {
        client.guilds.map(guild => {
          let channel = guild.channels.find(channel => channel.name === `${client.ConfigService.config.channel.mcBridge}`);
          if (channel) {
            channel.setTopic("Server Offline");
          }
        });
      }
      if (body.online === true) {
        client.guilds.map(guild => {
          let channel = guild.channels.find(channel => channel.name === `mc-channel`);
          if (channel) {
            channel.setTopic(`${client.user.username} | ${body.server.name} | ${body.players.now}/${body.players.max} online`);
            client.console("MC --> Discord | Set topic!");
          }
        });
      }
    } catch (e) {
      client.console(e);
    }
  }
  topic();
};
exports.time = 10000;
