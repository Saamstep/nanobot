exports.run = (client, message, args) => {
  if (!message.member.voiceChannel) {
    return client.error('You must be in the voice channel to lock it!', message);
  }

  let voiceChannels = message.guild.channels.filter(channel => channel.type == 'voice');
  let sourceVoiceChannel = voiceChannels.find(ch => ch.name == `${message.member.voiceChannel.name}`);

  if (sourceVoiceChannel.userLimit > 0) {
    sourceVoiceChannel
      .setUserLimit(0, `Channel unlocked by ${message.author}`)
      .then(vc => message.channel.send(`🔐 Successfully unlocked **${vc.name}**`));
  } else {
    sourceVoiceChannel
      .setUserLimit(sourceVoiceChannel.members.size, `Channel locked by ${message.author}`)
      .then(vc => message.channel.send(`🔒 Successfully locked **${vc.name}**`));
  }
};
