module.exports = function errorEvent(type, message) {
  // message.channel.send(':no_entry_sign: | ' + type);
  const embed = {
    description: `${type}`,
    color: 15415095,
    timestamp: Date.now(),
    // footer: {
    //   icon_url: clientInformation.userAgent
    //   text: "footer text"
    // },
    author: {
      name: "Error",
      icon_url: "https://samstep.net/bots/assets/error.png"
    }
  };
  message.channel.send({ embed });
  message.channel.stopTyping(true);
};
