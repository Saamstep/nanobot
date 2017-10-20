exports.run = (client, message, args) => {
  let roll = Math.floor((Math.random() * 6 ) + 1);
  message.reply(":game_die: | You rolled a " + roll);
};
