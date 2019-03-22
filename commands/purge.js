exports.run = (client, message, args) => {

  let log = require('../modules/logMod.js');

  let number = Number(args[0])
  number = parseInt(number + 1);
  message.channel.bulkDelete(number, true);
  message.channel.send(`♻ | Deleted ${number - 1} messages`)
  log("Purge", `Purged ${number - 1} of messages in ${message.channel}`, 14424069, message)

};