exports.run = (client, message, args) => {
  message.delete(1000);
  if (client.isAdmin(message.author, message, true, client)) {
    message.channel.send('', {
      files: args
    });
  }
};
