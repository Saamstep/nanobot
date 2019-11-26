exports.run = async (client, message, args, veriEnmap, cc) => {
  fs = require("fs");
  var m = JSON.parse(fs.readFileSync("./config.json").toString());
  // m.forEach(function(p) {
  //   p.name = m.name;
  // });
  const data = m;
  let msg = `${client.user.username} Settings | Change these config properties (except owner ID lol)\n-----\n= General =\n`;
  // console.log(data[args[0]]);
  // data.streamers.push("apple");
  // fs.writeFileSync("./test.json", JSON.stringify(m, null, 2));
  for (i in data) {
    if (i == "apis" || i == "token" || i == "mail") continue;
    if (Object.prototype.toString.call(data[i]) === "[object Object]") {
      let size = Object.keys(data[i]).length;
      for (k = 0; k < size; k++) {
        if (!msg.includes(i)) msg += "\n= " + i + " =\n";
        msg += Object.keys(data[i])[k] + " :: " + Object.values(data[i])[k] + "\n";
      }
      // msg += i + " >> " + Object.keys(data[i]) + "\n";
      // msg += "Values: " + Object.values(data[i]) + "\n";
    } else {
      msg += i + " :: " + data[i] + "\n";
    }
  }
  message.channel.send(`\`\`\`asciidoc\n${msg}\`\`\``);
};
exports.cmd = {
  enabled: true,
  category: "C",
  level: 3,
  description: "Desc"
};
