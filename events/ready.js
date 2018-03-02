exports.run = (client, member, message) => {
var config = require('../config.json');
var colors = require('colors');
const guildNames = client.guilds.map(g => g.name).join("\n")
console.log("+===========================================+".yellow)
console.log(`${config.serverName}`.underline.cyan + " bot is online!\n".cyan + `\nConnected to:`.cyan + `\n${guildNames}`.italic.cyan);
console.log("\n[IMPORTANT] KEEP THIS WINDOW OPEN FOR BOT TO STAY ONLINE".bold.red);
console.log("+===========================================+".yellow)

}
