exports.run = (client, message, args) => {
  let data1 = args[0];
  let data2 = args[1];
  let chooseVal = Math.floor((Math.random() * 2 ) + 1);
  if (chooseVal == 2) {

    message.reply("I choose " + data1);
  } else {
    message.reply("I choose " + data2);
  }

};
