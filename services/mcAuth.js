exports.run = (client, dupe, sendMessage) => {
  const fs = require("fs");
  const express = require("express");
  var app = express();
  //define guild from ID in config
  const guild = client.guilds.get(client.ConfigService.config.guild);
  app.use(express.json());
  app.listen(5000, () => {
    client.console("Listening at port 4000", "info", "Verification");
  });
  app.post("/newuser", (req, res) => {
    //some basic auth
    if (req.headers["key"] != client.ConfigService.config.apis.discordJoin) {
      //api key checker
      res.status(400).send({ error: "Invalid API Key" });
      //data in body checker
    } else if (Object.keys(req.body).length > 0) {
      res.status(200).send({ status: "Successful" });
      //DO STUFF HERE NOW
      client.rcon.send(`whitelist add ${req.body.username}`);
      let member = guild.members.find(m => m.user.username == req.body.discord.split("#")[0] && m.user.discriminator == req.body.discord.split("#")[1]);
      member.addRole(guild.roles.find(r => r.name == "Minecraft Server Player"));
      member.send(`> You have been whitelisted to our Minecraft Server with the account **${req.body.username}**\n> Please make sure to read the rules of the server at https://vchsesports.net/mcserver\n> The IP is ||\`mc.vchsesports.net:25580\`||`);
      sendMessage("minecraft-server-connected", `<@${member.user.id}> was whitelisted. Welcome to the server **${req.body.username}**`);
      // client.rcon.send(`whitelist add ${req.body.}`);
    } else {
      res.status(400).send({ error: "No body" });
    }
  });
};
