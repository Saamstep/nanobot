exports.run = (client, message, args) => {
  message.channel.sendMessage(":envelope_with_arrow: | DM sent!");
  message.author.sendMessage(":printer: | Commands can be found in the #welcome channel. More info at http://nerdbot.ga/").catch(console.error);
};
