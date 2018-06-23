exports.run = (client, message, args) => {

  message.react('👌');
  message.channel.stopTyping();


}
exports.description = 'Forces the stop typing command if it is in an infinite loop.'