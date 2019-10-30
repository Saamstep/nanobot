exports.run = (client, message, args) => {
  async function cmd() {
    let roll = Math.floor(Math.random() * 6 + 1);
    await message.channel.startTyping(1);
    await message.reply(':game_die: | You rolled a ' + roll);
    await message.channel.stopTyping(true);
  }

  cmd();
};
exports.cmd = {
  enabled: true,
  category: 'Fun',
  level: 0,
  description: 'Roll a dice.'
};
