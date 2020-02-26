exports.run = async (client, message, args, veriEnmap, cc) => {
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
        return console.log(err);
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
          client.console(error);
        } else {
          client.console("Email sent: " + info.response);
          sendMessage(`${client.ConfigService.config.channel.log}`, `Email sent to ${email} with content ${title}:${bodytext}`);
        }
      });
    });
  }
  /*
==TODO==
!teams create [] []
-- creates role
-- sets basic properties in json file

  */
  const teams = require("../teams.json");
  switch (args[0]) {
    case "list":
      let chunk = "";
      for (i in teams) {
        chunk += teams[i].name + "\n";
      }
      message.channel.send(chunk);
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
                  message.channel.send("Upload sucessful");
                });
                dest.on("error", reject);
              })
          )
          .then(x => console.log(x));
        await fs
          .createReadStream("./uploads/data.csv")
          .pipe(csv())
          .on("data", data => {
            //Manipulate data here
            console.log(data);
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
              client.console("Invalid Discord for " + data["Discord"]);
              sendMail(
                data["Email"],
                "ACTION REQUIRED: Invalid Discord Provided",
                `Hello there <b>${data["First Name"]}</b>,<br>We have you signed up for the <b>${data["Team"]}</b> team. However, the Discord account you provided <b>${data["Discord"]}</b> appears to be either invalid or not apart of our <a href="http://discord.vchsesports.net>VCHS Esports server</a>. Discord is our #1 communication method and it is required to be a part of our server. Please join with the hyperlink above or contact ModMail if you need to update your Discord username within our system. Have a good day!<br>-VCHS Esports`
              );
            } else {
              //valid member, we can proceed with adding roles and confirmation
              if (data["On VES"] == "TRUE") {
                let team = message.guild.roles.find(r => r.name == data["Team"]);
                if (team == null) return client.console("Could not find team " + data["Team"]);
                if (!member.roles.has(team.id)) {
                  member.addRole(team);
                  member.send(`You were granted the ${data["Team"]} role`);
                  sendMail(
                    data["Email"],
                    "Roster Confirmation",
                    `Hello there <b>${data["First Name"]}</b>,<br>We have you signed up for the <b>${data["Team"]}</b> team. You should have recieved proper roles via Discord. Have a good day!<br>-VCHS Esports`
                  );
                }
              } else {
                //if they are not on VES tell them they need to do that
                console.log(data["Discord"] + " is not on VES");
                // sendMail(
                //   data["Email"],
                //   "ACTION REQUIRED: Checklist Completion Required",
                //   `Hello there <b>${data["First Name"]}</b>,<br>We have you signed up for the <b>${data["Team"]}</b> team. However, you have not completed the <a href="example.com">Spring Majors 2020 checklist</a> yet. Please complete this and DM our ModMail bot when you have finished. Have a good day!<br>-VCHS Esports`
                // );
              }
            }
          })
          .on("end", err => {
            client.console("Done");
            message.channel.send("Data parsed");
          });
        await fs.unlink(`./uploads/data.csv`, err => {
          if (err) throw err;
          console.log("Deleted upload");
        });
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
