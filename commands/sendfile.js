exports.run = (client, message, args) => {
  message.delete(1000);
  if (client.isAdmin(message.author, message, true, client)) {
    message.channel.send('', {
      files: args
    });
  }
};
exports.cmd = {
  enabled: true,
  category: 'Admin',
  level: 2,
  description: 'Send a file as a bot.'
};
