exports.run = (client, message, args) => {
  message.channel.send('Help File:\n', {
    file: ['../commands.txt'
    ]
  }).catch(console.error);

};

exports.description = "Allows users to download all commands/descriptions."
