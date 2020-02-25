exports.run = async (client, message, args, veriEnmap, cc) => {
  const fs = require("fs");
  const csv = require("csv-parser");
  const fetch = require("node-fetch");

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
            } else {
              //valid member, we can proceed with adding roles and confirmation
              if (data["On VES"] == "TRUE") {
                let team = message.guild.roles.find(r => r.name == data["Team"]);
                if (team == null) return client.console("Could not find team " + data["Team"]);
                if (!member.roles.has(team.id)) {
                  member.addRole(team);
                  member.send(`You were granted the ${data["Team"]} role`);
                }
              } else {
                //if they are not on VES tell them they need to do that
                console.log(data["Discord"] + " is not on VES");
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
