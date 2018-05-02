exports.run = (client, message, args) => {
  let userInput = args[0].toLowerCase();
  let pcInput = Math.floor(Math.random() * 3 + 1);
  let correctVal = ['rock', 'paper', 'scissors'];
  let compressed = correctVal[pcInput];

  function computerValue() {
    message.channel.send(
      'The bot has chosen: ' + '`' + correctVal[pcInput] + '`'
    );
  }

  if (!userInput) {
    return message.channel.send('You must choose `rock, paper, or scissors`.');
  }

  function analyze(userInput, compressed) {
    if ((userInput = compressed)) {
      return message.channel.send("It's a tie!");
    }
    if (userInput == 'paper' && compressed == 'rock') {
      return message.channel.send('Bot wins!');
    }
  }

  computerValue();
  analyze();
};


exports.description = '(Non functional) Rock, paper, scissors.'
