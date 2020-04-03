exports.run = async (client, message, args) => {
  const fetch = require("node-fetch");
  let chunk = "";
  try {
    const response = await fetch("https://14qjgk812kgk.statuspage.io/api/v2/components.json");
    const data = await response.json();
    for (i in data.components) {
      let connected = data.components[i].status == "operational";
      chunk += `**${data.components[i].name}** ${connected ? ":white_check_mark:\n" : ":x:\n"}`;
    }
    message.channel.send(chunk).then(msg => msg.react("🗑️"));
  } catch (e) {
    client.console(e, "error", "zoom");
  }
};

exports.cmd = {
  enabled: true,
  category: "Utility",
  level: 0,
  description: "Check zoom.us status"
};
