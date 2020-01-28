exports.run = (client, dupe, veriEnmap, sendMessage) => {
  const fs = require("fs");
  const express = require("express");
  var app = express();
  //define guild from ID in config
  const guild = client.guilds.get(client.ConfigService.config.guild);
  app.use(express.json());
  app.listen(4000, () => {
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
      client.console(`New data for verification incoming... it\'s from ${req.body.discord} (${req.body.name}) with the email ${req.body.email}`, "info", "Verification");
      //split the discord username + discrim
      let user = req.body.discord.split("#");
      //find member in guild
      let member = guild.members.find(member => member.user.username == user[0] && member.user.discriminator == user[1]);
      //if the member isnt in the guild return an error in console
      if (member == null) {
        client.console(`${req.body.discord} returned ${member}`, "error", "Verification");
        sendMessage(client.ConfigService.config.channel.log, `> __VCHS Esports Verification__\n> **${req.body.discord}** returned ${member}\n> Contact **${req.body.email}** to fix`);
        return;
      }
      //if the member already has the join role that means they are already verified so.. tell them that someone is about to hacks them!!
      if (member.roles.has(guild.roles.find(role => role.name == client.ConfigService.config.roles.iamRole).id))
        return member.send({
          embed: {
            description: "Someone tried to verify their Discord account as you! If this was you, you may ignore this message. If this was not you please DM <@586740266354999299> immediately!",
            color: 2582446,
            footer: {
              text: "VCHS Esports Verification"
            },
            author: {
              name: "Verification Notice",
              icon_url: client.user.avatarURL
            }
          }
        });
      //give member their class role
      member.addRole(guild.roles.find(role => role.name == req.body.class));
      //give member the join role
      member.addRole(guild.roles.find(role => role.name == client.ConfigService.config.roles.iamRole));
      //send them a confirmation
      member.send({
        embed: {
          description: `You have been verified sucessfully in the **${guild.name}** official Discord server. Here is your info for confirmation. Remember to read <#476920535520116736> for more server info!`,
          color: 2582446,
          footer: {
            text: "VCHS Esports Verification"
          },
          author: {
            name: "Verification Confirmation",
            icon_url: client.user.avatarURL
          },
          image: {
            url: guild.splashURL
          },
          fields: [
            {
              name: "Name",
              value: req.body.name
            },
            {
              name: "Discord",
              value: req.body.discord
            },
            {
              name: "Email",
              value: req.body.email
            },
            {
              name: "Class",
              value: req.body.class
            }
          ]
        }
      });
      sendMessage("general", `✅ **${member.user.username}** is now verified, everyone welcome ${req.body.name} to the server!`);
    } else {
      //if no body.. return this
      res.status(400).send({ error: "No data found" });
    }
  });
};
