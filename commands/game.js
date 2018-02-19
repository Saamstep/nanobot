 exports.run = (client, message, args) => {
   let game = args.join(' ');
   
   if (game.length <= 10) {
     client.user.setPresence({game: {name: game, type: 0} }).catch(console.error);
     message.channel.send(":ok_hand: | Successfully changed the game to: " + "`" + game + "`");
   }
   if (game.length > 10) {
     return message.reply(":no_entry_sign: | `" + game + "` is too long!");

   }
   if (game === 'null') {
     return message.reply(':no_entry_sign: | Game cannot be empty.');
   }





   exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['g'],
    permLevel: 5
  };
    
  exports.help = {
    name: 'game',
    description: 'Sets the playing message',
    usage: 'game [new]'
  }


 };
