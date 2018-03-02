exports.run = (client, member, message) => {
    var config = require("../config.json");
    const logEvent = require("../modules/logMod.js");
    let guild = member.guild;
    let guildName = guild.name;

    logEvent("User Banned", `${member} was banned.`, 16267834, message);
  };
  