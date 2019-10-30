exports.run = (client, message, args) => {
  message.delete();
  message.channel.stopTyping(true);
};
exports.cmd = {
  enabled: true,
  category: 'Utility',
  level: 1,
  description: 'Forces the stop typing command if it is in an infinite loop.'
};
