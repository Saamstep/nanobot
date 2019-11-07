exports.run = (client, message, args) => {
  let components = args
    .join(' ')
    .toLowerCase()
    .split('');
  message.delete(0);
  const emojiChars = require('../emojiCharacters');
  // if (components.includes(' ')) {
  //   let pos = components.indexOf(' ');
  //   components[pos] = 'space';
  // }
  console.log(components);
  let msg = '';
  for (i in components) {
    const letter = components[i];
    msg += letter.replace(letter, `${emojiChars.text[letter] || ' '}`);
  }
  message.channel.send(msg);
};

exports.cmd = {
  enabled: true,
  category: 'Fun',
  level: 0,
  description: 'Make text bigger and better than before!'
};
