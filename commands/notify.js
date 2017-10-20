exports.run = (client, message, args) => {
  let notifyRole = message.guild.roles.find("name", "Notifications");
//  let guild = message.guild;
  let options  = args[0];
  if (options === "on") {
    message.member.addRole(notifyRole).catch(error => console.log(error));
    message.reply("You will now be notified on all our announcements and polls!");
  } if (options === "off") {
    message.member.removeRole(notifyRole).catch(error => console.log(error));
    message.reply("You have turned your notifications off! If you wish to re-enable them: `!notify on`");
  } else {
    return;
  }



};
