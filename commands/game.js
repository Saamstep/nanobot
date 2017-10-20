 exports.run = (client, message, args) => {
   let game = args.join(' ');

   if (message.author.id !== '136637808063414272') {
     return message.reply(":no_entry_sign: | You are not the bot owner :P");
   }
   if (game.length <= 10) {
     client.user.setGame(game).catch(console.error);
     message.channel.send(":ok_hand: | Successfully changed the game to: " + "`" + game + "`");
   }
   if (game.length > 10) {
     return message.reply(":no_entry_sign: | `" + game + "` is too long!");
   }

 };
