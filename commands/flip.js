exports.run = (client, message, args) => {
  let coinVal = Math.floor(Math.random() * 2 + 1);
  if (coinVal == 2) {
    message.channel.send(":arrows_counterclockwise: | Heads");
  } else {
    message.channel.send(":arrows_counterclockwise: | Tails");
  }
};

exports.cmd = {
  enabled: true,
  category: "Fun",
  level: 0,
  description: "Flip a coin",
};
