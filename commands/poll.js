exports.run = (client, message, args) => {
  message.delete(100);
  let emojis = require('../emojiCharacters.js');
  let title = message.content.substring(message.content.indexOf('(') + 1, message.content.indexOf(')'));
  let options = args
    .join(' ')
    .replace(`(${title})`, '')
    .split('|');

  if (!args || !message.content.includes('|')) {
    return message.channel.send(
      `\`\`\`${client.ConfigService.config.prefix}poll (Title Here) Option 1|Option 2|Option n...\`\`\``
    );
  }
  if (options.length > 10) {
    return client.error('Poll is limited to 10 options', message);
  }

  let msg = '';
  for (i = 0; i < options.length; i++) {
    msg += `${emojis[i + 1]} *=>* ${options[i].trim()}\n\n`;
  }

  const embed = {
    title: 'Question: ' + title,
    description: msg,
    timestamp: Date.now(),
    footer: {
      icon_url: `${client.user.avatarURL}`,
      text: `${client.user.username} - Polls`
    },
    author: {
      name: `${message.author.username}'s Poll`,
      icon_url: `${message.author.avatarURL}`
    }
  };

  message.channel
    .send({ embed })
    .then(async function(m) {
      for (j = 0; j < options.length; j++) {
        await m.react(`${emojis[j + 1]}`);
      }
    })
    .catch(e => console.error(e));
};
