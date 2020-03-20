exports.run = async (client, message, args, cc) => {
  const fs = require("fs");
  const csv = require("csv-parser");
  const fetch = require("node-fetch");
  var nodemailer = require("nodemailer");
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: client.ConfigService.config.mail.user,
      pass: client.ConfigService.config.mail.pass
    }
  });
  function sendMail(email, title, bodytext) {
    //add discord invite to html
    fs.readFile("./html/confirm.html", "utf8", function(err, data) {
      if (err) {
        return client.console(err, 0, "Team Assign");
      }
      let result = data.replace(/BODYTEXT/g, bodytext).replace(/INLINETITLE/g, title);

      let mailOptions = {
        from: "DiscordBot",
        to: `${email}`,
        subject: `${title}`,
        html: `${result}`
      };

      // finally sends the email to the user with the code so they know what it is!
      transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
          client.console(error, 0, "Team Assign");
        } else {
          client.console("Email sent: " + info.response, "info", "Team Assign");
          sendMessage(`${client.ConfigService.config.channel.log}`, `Email sent to ${email} with content ${title}:${bodytext}`);
        }
      });
    });
  }

  switch (args[0]) {
    case "create":
      message.guild
        .createRole({
          name: args
            .join(" ")
            .replace(args[0], "")
            .trim(),
          color: "RANDOM",
          hoist: true,
          mentionable: false,
          position: 38
        })
        .then(role => {
          message.channel.send(`> Added team role **${role.name}**`);
          message.guild.channels
            .find(ch => ch.name == "team-announcements")
            .overwritePermissions(role, {
              VIEW_CHANNEL: true,
              SEND_MESSAGES: false
            });
        });
      break;
    case "assign":
      async function process() {
        if (message.attachments.size == 0) return client.error("Please upload a csv file to import!", message);
        await fetch(message.attachments.first().url)
          .then(
            res =>
              new Promise((resolve, reject) => {
                const dest = fs.createWriteStream("./uploads/data.csv");
                res.body.pipe(dest);
                res.body.on("end", () => {
                  resolve("it worked");
                  message.channel.send(`> csv \`${message.attachments.first().filename}\` downloaded sucessfully`);
                });
                dest.on("error", reject);
              })
          )
          .then(x => client.console(x, "info", "Team Assign"));
        await fs
          .createReadStream("./uploads/data.csv")
          .pipe(csv())
          .on("data", data => {
            //Manipulate data here
            client.console(data, "info", "Team Assign");
            fs.appendFile("./uploads/results.txt", `Generated on ${new Date()}\n`, "utf8", err => {
              if (err) throw err;
            });
            /*
            data["First Name"]
            data["Last Name"]
            data["Email"]
            data["Discord"]
            data["Team"]
            */
            let member = message.guild.members.find(member => member.user.username == data["Discord"].split("#")[0] && member.user.discriminator == data["Discord"].split("#")[1]);
            if (member == null) {
              //invalid discord checker should send an email to them with the error and they should contact modmail or email back
              client.console("Invalid Discord for " + data["Discord"], "info", "Team Assign");
              sendMail(
                data["Email"],
                "ACTION REQUIRED: Invalid Discord Provided",
                `Hello there <b>${data["First Name"]}</b>,<br>We have you signed up for the <b>${data["Team"]}</b> team. However, the Discord account you provided <b>${data["Discord"]}</b> appears to be either invalid or not a member in our <a href="http://discord.vchsesports.net">VCHS Esports server</a>. Discord is our #1 communication method and it is required to be a member in our server. Please join with the hyperlink above or contact <b style="color:#33daa5">@ModMail</b> if you need to update your Discord username within our system. Have a good day!<br>-VCHS Esports`
              );
              fs.appendFile("./uploads/results.txt", `===[Invalid Discord]===\n${data["First Name"]} ${data["Last Name"]}\n${data["Discord"]}\n${data["Email"]}`, "utf8", err => {
                if (err) throw err;
              });
            } else {
              //valid member, we can proceed with adding roles and confirmation
              if (data["On VES"] == "TRUE") {
                let team = message.guild.roles.find(r => r.name == data["Team"]);
                if (team == null) return client.console("Could not find team " + data["Team"], "info", "Team Assign");
                if (!member.roles.has(team.id)) {
                  member.addRole(team);
                  member.send({ embed: { description: `You joined the **${data["Team"]}** team` } });
                  sendMail(
                    data["Email"],
                    "Roster Confirmation",
                    `Hello there <b>${data["First Name"]}</b>,<br>We have you signed up for the <b>${data["Team"]}</b> team. You should have recieved proper roles via Discord. Have a good day!<br>-VCHS Esports`
                  );
                  fs.appendFile("./uploads/results.txt", `===[Joined Successfully]===\n${data["First Name"]} ${data["Last Name"]}\n${data["Discord"]}\n${data["Email"]}\n${data["Team"]}`, "utf8", err => {
                    if (err) throw err;
                  });
                } else {
                  client.console(data["Discord"] + " already has their roles!", "info", "Team Assign");
                  fs.appendFile("./uploads/results.txt", `===[Already has Roles]===\n${data["First Name"]} ${data["Last Name"]}\n${data["Discord"]}\n${data["Email"]}\n${data["Team"]}`, "utf8", err => {
                    if (err) throw err;
                  });
                }
              } else {
                //if they are not on VES tell them they need to do that
                client.console(data["Discord"] + " is not on VES", "info", "Team Assign");
                member.send({
                  embed: {
                    description: `Hello! We have you signed up for the  **${data["Team"]}** team. However, you have not completed the [Spring Majors 2020 checklist](https://docs.google.com/document/d/1-qS5kgTkzaPj-Er8kbHK7S53QoOBlie7OPUmdZCqO0o/edit?usp=sharing). Please complete this and DM our @ModMail bot when you have finished so we can add you to the roster officially.`
                  }
                });
                sendMail(
                  data["Email"],
                  "ACTION REQUIRED: Checklist Completion Required",
                  `Hello there <b>${data["First Name"]}</b>,<br>We have you signed up for the <b>${data["Team"]}</b> team. However, you have not completed the <a href="https://docs.google.com/document/d/1-qS5kgTkzaPj-Er8kbHK7S53QoOBlie7OPUmdZCqO0o/edit?usp=sharing">Spring Majors 2020 checklist</a> yet. Please complete this and DM our <b style="color:#33daa5">@ModMail</b> bot when you have finished, we can then officially add you to the team! Have a good day!<br>-VCHS Esports`
                );
                fs.appendFile("./uploads/results.txt", `===[No VES]===\n${data["First Name"]} ${data["Last Name"]}\n${data["Discord"]}\n${data["Email"]}\n${data["Team"]}`, "utf8", err => {
                  if (err) throw err;
                });
              }
            }
          })
          .on("end", err => {
            client.console("Done", "info", "Team Assign");
            message.channel.send("> Roles assigned! The bot has DM'd you a receipt.");
          });
        await fs.unlink(`./uploads/data.csv`, err => {
          if (err) throw err;
          client.console("Deleted upload", "info", "Team Assign");
        });
        await message.author.send({ files: ["./uploads/results.txt"] });
        await fs.unlink("./uploads/results.txt");
      }
      process();
      break;
  }
};

exports.cmd = {
  enabled: true,
  category: "VCHS Esports",
  level: 3,
  description: "Manage Discord roles/teams"
};
