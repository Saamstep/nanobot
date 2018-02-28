const config = require('../config.json');
const fs = require("fs")
const logEvent = require("../logMod.js");
exports.run = (client, message, args) => {
    let option = args[0];
    
// allows you to change options from config.json file
switch (option) {
    case "prefix":
        let newPrefix = args[1]
        config.prefix = newPrefix;
        // fs.writeFile("./config.json", JSON.stringify(config, null, 2), (err) => console.error);
        fs.writeFile("./config.json", JSON.stringify(config, null, 2), (err) => console.error);
        message.channel.send(`New prefix is now **${newPrefix}**`)
        logEvent("New Prefix", `Prefix has been changed to **${newPrefix}**`, 16776960,  message);
        break;
    case "ip":
        let newIP = args[1];    
        config.mcIP = newIP;
        fs.writeFile("./config.json", JSON.stringify(config, null, 2), (err) => console.error);
        message.channel.send(`IP changed to **${newIP}**`)
        logEvent("IP Updated", `IP has been changed to **${newIP}**`, 16776960,  message);
        break;
    case "port":
        let newPort = args[1];
        if (newPort === "reset") {
            config.mcPort = ""
            fs.writeFile("./config.json", JSON.stringify(config, null, 2), (err) => console.error);
            message.channel.send(`Port reset`)
            logEvent("Port Reset", `The current port has been removed`, 16776960,  message);
        } else {
        config.mcPort = newPort
        fs.writeFile("./config.json", JSON.stringify(config, null, 2), (err) => console.error);
        message.channel.send(`Port changed to **${newPort}**`)
        logEvent("New Port", `Port has been changed to **${newPort}**`, 16776960,  message);
        }
        break;
    case "acceptmessage":
        let tl = args[1]
        let newAcceptMessage = args.join(' ').replace('acceptmessage', "");
        config.acceptMessage = newAcceptMessage
        fs.writeFile("./config.json", JSON.stringify(config, null, 2), (err) => console.error);
        message.channel.send(`Accept message changed to **${newAcceptMessage}**`)
        logEvent("Accept Message", `Accept Message has been changed to **${newAcceptMessage}**`, 16776960,  message);
        break;
    case "logchannel":
        let newLog = args[1];
        if (newLog.includes("#")) {
        return message.channel.send("Just write the name of the channel.");
        } else {
        config.log = newLog
        fs.writeFile("./config.json", JSON.stringify(config, null, 2), (err) => console.error);
        message.channel.send(`Log channel changed to **${newLog}**`)
        logEvent("Log Channel Update", `Log Channel has been changed to **${newLog}**`, 16776960,  message);
    }
        break;
    case "servername":
        let newServerName = args.join(' ').replace('servername', "");
        config.serverName = newServerName
        fs.writeFile("./config.json", JSON.stringify(config, null, 2), (err) => console.error);
        message.channel.send(`Server name changed to **${newServerName}**`)
        logEvent("Server Name", `Server Name has been changed to **${newServerName}**`, 16776960,  message);
        break;
    case "debug":
        let newDebug = args[1];
        if (newDebug === 0) {
            config.debug = newDebug
            fs.writeFile("./config.json", JSON.stringify(config, null, 2), (err) => console.error);
        }
    default:
         message.channel.send(`*You can edit these values using this syntax
               ${config.prefix}set [option] [newOne]*\n`)
    //usage
        message.channel.send(`__Usage__\n**Prefix:** ${config.prefix}\n**Log Channel:** ${config.log}`);
    //text
        message.channel.send(`__Text__\n**Server Name:** ${config.serverName}\n**Accept Message:** ${config.acceptMessage}\n**IP:** ${config.mcIP}\n**Port:** *(Leave empty if none)* ${config.mcPort}`);
    //roles
        message.channel.send(`__Roles__\n**Mod Role:** ${config.modrolename}\n**Admin Role:** ${config.adminrolename}\n**Member Role:** ${config.memberrole}\n`);
}


}
