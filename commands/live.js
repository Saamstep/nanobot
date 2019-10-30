exports.run = async (client, message, args) => {
  if (!message.member.voiceChannel) return client.error('Join a voice channel!', message);
  const voiceChannels = message.guild.channels.filter(channel => channel.type === 'voice');
  const vc = voiceChannels.find(n => n.name == `${message.member.voiceChannel.name}`);

  if (vc.name.includes('🔴')) {
    let newName = vc.name.replace('🔴', '');
    vc.edit({ name: `${newName}` });
  } else {
    let current = vc.name;
    vc.edit({ name: `🔴 ${current}` });
  }
};
exports.cmd = {
  enabled: true,
  category: 'Utility',
  level: 0,
  description: 'Mark the current voice channel as live (with a red dot)'
};
