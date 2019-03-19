exports.run = async (client, message, args) => {
  let error = require('../modules/errorMod.js');
  try {
    let voiceChannels = message.guild.channels.filter(channel => channel.type === 'voice');
    // let sourceVoiceChannel = message.guild.channels.filter(channel => channel.type === 'voice', channel.name === `${args[0]}`);
    // let destination = message.guild.channels.filter(channel => channel.type === 'voice', channel.name === `${args[1]}`);

    let sourceVoiceChannel = voiceChannels.find('name', `${message.member.voiceChannel.name}`);
    let destinationVoiceChannel = voiceChannels.find('name', `${args.join(' ')}`);
    let isMod = require('../modules/isMod.js');

    if (isMod(message.author, message)) {
      {
        let sourceVoiceChannelMember = sourceVoiceChannel.members.array();
        for (let member of sourceVoiceChannelMember) {
          await member.setVoiceChannel(destinationVoiceChannel).catch((e) => error(e, message));
        }
        message.react('👌')
      }
    }
  } catch (e) {
    error("You either are not in a voice channel, don't have the correct permissions or messed up badly!", message)
  }





}
