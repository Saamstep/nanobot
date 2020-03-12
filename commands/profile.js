exports.run = (client, message, args, cc) => {
  const fs = require("fs");
  const canvas = require("canvas");
  let profile = {
    bio: "This is a default bio.",
    headerURL: "",
    nickname: "",
    bkgnd: 0
  };

  client.profiles.defer.then(() => {
    if (client.profiles.has(message.author.id)) {
      //do stuff with data
    } else {
      // const temp = canvas.loadImage("./images/PROFILE.png");
      // temp.then(img => {
      //   console.log(img);
      //   const attachment = new client.Discord.Attachment(img.toBuffer(), "welcome-image.png");
      //   message.channel.send("", attachment);
      // });
      // client.error(`You do not have a profile! Creating one now...\nModify your profile with ${client.ConfigService.config.prefix}profile`, message);
      // profile.set(message.author.id, profile);

      fs.readFile("./images/PROFILE.svg", "utf8", (err, data) => {
        if (err) throw err;
        data = data.replace(/USERNAME#1234/g, message.author.username);
        fs.writeFile(`./images/profiles/${message.author.id}.svg`, data, err => {
          if (err) throw err;
          console.log("The file has been saved!");
        });
      });
      const embed = {
        image: {
          url: `https://discordapp.com/assets/e4923594e694a21542a489471ecffa50.svg`
        }
      };
      message.channel.send({
        embed,
        files: [
          {
            attachment: `./images/profiles/136637808063414272.svg`,
            name: `136637808063414272.svg`
          }
        ]
      });
      // const attachment = new client.Discord.MessageAttachment(`./images/profiles/136637808063414272.svg`);
      // console.log(attachment);
      // message.channel.send({ embed }, attachment);
    }
  });
};
exports.cmd = {
  enabled: false,
  category: "Fun",
  level: 0,
  description: "Create/view your profile"
};
