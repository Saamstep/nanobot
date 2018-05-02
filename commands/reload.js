exports.run = (client, message, args) => {
  if (!args) return message.reply('Must provide a command name to reload.');
  // the path is relative to the *current folder*, so just ./filename.js

  if (args) {
    delete require.cache[require.resolve(`./${args[0]}.js`)];
    message.reply(`The command ${args[0]} has been reloaded`);
  }
};

exports.description = 'Reloads a command.'