exports.run = (client, message, args) => {
  let data1 = args[0];
  let data2 = args[1];
  let chooseVal = Math.floor((Math.random() * 2 ) + 1);
  if (chooseVal == 2) {

    message.reply("I choose " + data1);
  } else {
    message.reply("I choose " + data2);
  }

  exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['other', 'o'],
    permLevel: 0
  };
    
  exports.help = {
    name: 'choose',
    description: 'Choose between 2 things',
    usage: 'choose [thing1] [thing2]'
  }

};
