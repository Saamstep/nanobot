exports.run = (client, message, args) => {
  message.channel.send(":envelope_with_arrow: | DM sent!");
  message.author.send(":printer: | **The commands command is being re-written. Please refer to the github (http://www.github.com/honeydewbot/wiki/Commands) or ask @Samstep#4487.**").catch(console.error);
};
