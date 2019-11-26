exports.run = async (client, message, args, veriEnmap, cc) => {
  fs = require("fs");
  var m = JSON.parse(fs.readFileSync("./config.json").toString());
  const data = m;

  function hasNoDisabled(input) {
    if (input == "token" || input == "ownerid" || input.includes("apis")) {
      return false;
    } else {
      return true;
    }
  }
  function push(out) {
    fs.writeFileSync("./test.json", JSON.stringify(out, null, 4));
  }

  switch (args[0]) {
    case "add":
      break;
    case "remove":
      break;
    case "edit":
      if (hasNoDisabled(args[1]) && !args[1].includes(",")) {
        data[args[1]] = args[2];
        push(data);
      }
      if (hasNoDisabled(args[1]) && args[1].includes(".")) {
        let copy = args[1].split(".");
        data.copy[0].copy[1];
      }
      break;
    default:
      let msg = `${client.user.username} Settings | Change these config properties (except owner ID lol)\n-------\n<General>\n`;
      for (i in data) {
        if (i == "apis" || i == "token" || i == "mail") continue;
        if (Object.prototype.toString.call(data[i]) === "[object Object]") {
          for (k = 0; k < Object.keys(data[i]).length; k++) {
            if (!msg.includes(i)) msg += "\n<" + i + ">\n";
            msg += "< " + Object.keys(data[i])[k] + " > ";
            if (Array.isArray(Object.values(data[i])[k])) {
              msg +=
                Object.values(data[i])
                  [k].join(" | ")
                  .replace("_", "-") + "\n";
            } else {
              msg += Object.values(data[i])[k] + "\n";
            }
          }
        } else {
          let output = data[i];
          if (Array.isArray(output)) output = data[i].join(" | ").replace("_", "-");
          msg += "< " + i + " > " + output + "\n";
        }
      }
      message.channel.send(`\`\`\`md\n${msg}\`\`\``);
      break;
  }
};
exports.cmd = {
  enabled: true,
  category: "Utility",
  level: 3,
  description: "View and change bot settings"
};
