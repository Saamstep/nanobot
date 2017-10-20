exports.run = (client, message, args) => {
  // Finding a random number between 1 and 100
  let random = Math.floor((Math.random() * 100 ) + 1);
  message.reply(":1234: | You rolled a " + random);
};
