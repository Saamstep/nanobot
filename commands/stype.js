exports.run = (client, message, args) => {
  message.delete();
  message.channel.stopTyping(true);

};
exports.description =
  'Forces the stop typing command if it is in an infinite loop.';
