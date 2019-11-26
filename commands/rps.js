exports.run = (client, message, args) => {
  let choices = ["rock", "paper", "scissors"];
  const USER_PLAYER = `${message.author} wins!`;
  const COMPUTER_PLAYER = `${client.user} wins!`;
  const TIE = `It's a tie!`;
  if (!args[0]) return client.error(`Choose a move...\`\`\`rock\npaper\nscissors \`\`\``, message);
  if (choices.indexOf(args[0]) == -1) {
    return client.error(`Choose a move...\n\`\`\`rock\npaper\nscissors\`\`\``, message);
  }
  let computer = choices[Math.floor(Math.random() * 3 + 1) - 1];
  let user = args[0];
  function calculate(user, computer) {
    if (user == "rock" && (computer == "paper" || computer == "scissors")) {
      return USER_PLAYER;
    } else if (user == computer) {
      return TIE;
    } else if (user == "scissors" && computer == "paper") {
      return USER_PLAYER;
    } else {
      return COMPUTER_PLAYER;
    }
  }
  const embed = {
    description: calculate(user, computer),
    author: {
      name: "RPS"
    },
    footer: {
      text: `${client.user.username} - Fun`
    },
    fields: [
      {
        name: "User Choice",
        value: user
      },
      {
        name: "Computer Choice",
        value: computer
      }
    ]
  };
  message.channel.send({ embed });
};
exports.cmd = {
  enabled: true,
  category: "Fun",
  level: 0,
  description: "Play Rock, paper, scissors with the bot!"
};
