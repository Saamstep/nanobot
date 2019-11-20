const colors = require("colors");
const fetch = require("node-fetch");
const fs = require("fs");

//throw err function
const err = function(s) {
  throw s.red.bold;
};

exports.run = async function(client, member, message) {
  await console.log(
    `+--------------------${`Nano Startup`.inverse}--------------------+`.yellow
  );

  // Check discord status
  try {
    var url = "https://srhpyqt94yxb.statuspage.io/api/v2/status.json/";
    const response = await fetch(url);
    const body = await response.json();

    if (!response.ok) {
      err(
        "DISCORD_STATUS_REQUEST. The Discord API gave us a baaad response..."
      );
    }

    if (body.status.description == "All Systems Operational") {
      client.console(
        "All systems operational!".blue.bold,
        "info",
        "Discord Status"
      );
    } else {
      client.console(
        "There seems to be an error with some of the Discord Servers. Double check https://status.discordapp.com/"
          .red,
        "warn",
        "Ready"
      );
    }
  } catch (e) {
    err("DISCORD_STATUS_REQUEST. The Discord API gave us a baaad response...");
  }
  //Tell the console the bot is online!
  await client.console(
    ``.blue +
      `${client.user.username}#${client.user.discriminator}`.bold.blue +
      " bot online!".blue.reset,
    "info",
    "Bot"
  );

  //list guilds connected to
  await client.console(
    "Connected to => ".blue +
      client.guilds.map(g => g.name).join(", ").bold.blue,
    "info",
    "Guilds"
  );

  //Load commands
  const cmds = await fs.readdirSync("./commands");
  await client.console(
    "Loaded ".green + cmds.length + " commands".green,
    "info",
    "Commands"
  );
  //Load custom commands
  await client.console(
    "Loaded ".green + client.ccSize + " custom commands".green,
    "info",
    "Commands"
  );
  //set playing status
  await client.user
    .setPresence({
      game: { name: `${client.ConfigService.config.defaultGame}`, type: 0 }
    })
    .catch(console.error);
  await client.console(
    `Presence set to ${client.ConfigService.config.defaultGame.underline}`.green
  );
  //print to console if debug mode enabled
  if (client.ConfigService.config.debug == true) {
    client.console("Debug is enabled:\n".green);
  }
};
