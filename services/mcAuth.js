exports.run = async (client, dupe, sendMessage) => {
  const fs = require("fs");
  const fetch = require("node-fetch");
  const express = require("express");
  var app = express();
  //define guild from ID in config
  const guild = client.guilds.get(client.ConfigService.config.guild);
  app.use(express.json());
  app.listen(5000, () => {
    client.console("Listening at port 5000", "info", "mcAuth");
  });
  app.post("/newuser", async (req, res) => {
    //some basic auth
    if (req.headers["key"] != client.ConfigService.config.apis.discordJoin) {
      //api key checker
      res.status(400).send({ error: "Invalid API Key" });
      //data in body checker
    } else if (Object.keys(req.body).length > 0) {
      res.status(200).send({ status: "Successful" });
      //DO STUFF HERE NOW
      try {
        const usr = await fetch(`https://api.mojang.com/users/profiles/minecraft/${req.body.username}`);
        const user = await usr.json();
        console.log(user);
      } catch (e) {
        if (e.type == "invalid-json") {
          return sendMessage(client.ConfigService.config.channel.log, `> __AutoWhitelist__\n> The AutoWhitelister failed for username **${req.body.username}**. This username does not exist.`);
        } else {
          client.console(e, "error", "mcAuth");
        }
      }
      // await require("./rcon.js").run(client, "");
      await client.rcon.send(`whitelist add ${req.body.username}`);
      // await require("./rcon.js").run(client, "dc");
      console.log(req.body.discord);
      if (req.body.discord.includes("#")) {
        let member = guild.members.find((m) => m.user.username == req.body.discord.split("#")[0] && m.user.discriminator == req.body.discord.split("#")[1]);
        member.addRole(guild.roles.find((r) => r.name == "Minecraft Server Player"));
        member.send(`> You have been whitelisted to our Minecraft Server with the account **${req.body.username}**\n> Please make sure to read the rules of the server at https://vchsesports.net/mcserver\n> The IP is ||\`mc.vchsesports.net\`||`);
        sendMessage("minecraft-server-connected", `<@${member.user.id}> was whitelisted. Welcome to the server **${req.body.username}**`);
      }
    } else {
      res.status(400).send({ error: "No body" });
    }
  });
};
