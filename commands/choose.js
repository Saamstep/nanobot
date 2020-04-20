exports.run = (client, message, args) => {
  const chooseVal = Math.floor(Math.random() * 2 + 1);
  const ConfigService = require("../config.js");

  let choice = args.join(" ").split("|");

  if (choice[0].length == "" || choice[1] == "" || !args.join(" ").includes("|") || choice.length > 2) {
    return message.channel.send(`${ConfigService.config.prefix}choose [option1]|[option2]`, { code: "asciidoc" });
  }

  if (chooseVal == 2) {
    message.channel.send("I choose `" + choice[0] + "`");
  } else {
    message.channel.send("I choose `" + choice[1] + "`");
  }
};

exports.cmd = {
  enabled: true,
  category: "Fun",
  level: 0,
  description: "Choose between two items",
};
