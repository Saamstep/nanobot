exports.run = (client, message, args, cc) => {
  if (message.member.roles.has(message.guild.roles.find(r => r.name == "Bell").id)) {
    message.member.send({
      embed: {
        description: "✅ You will no longer recieve bell schedule notifications."
      },
      image: { url: "https://imgur.com/6mkkP0a" }
    });
    message.member.removeRole(message.guild.roles.find(r => r.name == "Bell"));
  } else {
    message.member.send({
      embed: {
        description:
          "✅ You will now get Bell schedule notifications. Please make sure to turn **OFF** this toggle switch (shown in image) in server notification settings to recieve bell notifications properly. If you cannot see the image or need more help click [here](https://support.discordapp.com/hc/en-us/articles/215253258-Notifications-Settings-101).",
        image: { url: "https://imgur.com/6mkkP0a" }
      }
    });
    message.member.addRole(message.guild.roles.find(r => r.name == "Bell"));
  }
};

exports.cmd = {
  enabled: true,
  category: "VCHS Esports",
  level: 0,
  description: "Subscribe/unsubscribe to bell schedule Discord notifications"
};
