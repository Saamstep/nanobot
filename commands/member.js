exports.run = (client, message, args) => {
let newmember = message.mentions.users.first().catch(console.error);

let modRole = message.guild.roles.find("name", "Mods");

if (!message.member.roles.has(modRole.id)) {
  return message.reply(":no_entry_sign: | Error. You don't have the right permissions").catch(console.error);
}
if (message.mentions.users.size === 0) {
  return message.reply(":no_entry_sign: | Please mention a user to promote").catch(console.error);
}
let promote = message.guild.member(message.mentions.users.first()).catch(console.error);
if (!promote) {
  return message.reply(":no_entry_sign: | That user does not seem valid").catch(console.error);
}
  message.newmember.send("Welcome to NanoSMP! Congradulations your application was accepted. Please make sure to read the **welcome** channel for more information. The IP is: `nanosmp.us.to;25560`; enjoy crafting!").catch(console.error);

}
