exports.run = (client, message, args) => {
  if (client.isMod(message.author, message, client)) {
    async function cmd() {
      let number = Number(args[0]);
      number = parseInt(number);
      await message.channel.bulkDelete(number, true);
      await message.channel.send(`♻ | Deleted ${number} messages`).then(msg => {
        msg.delete(3000);
      });
      client.log('Purge', `Purged ${number} of messages in ${message.channel}`, 14424069, message, client);
    }
    cmd();
  }
};
exports.cmd = {
  enabled: true,
  category: 'Moderation',
  level: 1,
  description: 'Allows moderators to purge x messages in current channel.'
};
