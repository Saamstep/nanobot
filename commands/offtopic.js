
const isAdmin = require('../modules/isAdmin.js');

exports.run = async (client, message, args) => {

  let member = message.guild.member(message.mentions.users.first());
  message.delete(0);
  if (isAdmin(message.author, message)) {
    return member.send("Just a friendly reminder that the <#524099794227167232> channel is for work related content only :)");
  }
}
exports.description = "Keeps people on track!"
