exports.run = (client, message, args) => {

  if (message.author.id !== '136637808063414272') {
    return message.reply(":no_entry_sign: | You are not the bot owner!");
  } else {
    client.destroy((err) => {
      console.log("====================");
      console.log("Command: [!@shutdown] run by " + message.author.username);
      console.log("====================");
      console.log(err);
    });
  }
};

exports.description = 'Force shutdown the bot.'
