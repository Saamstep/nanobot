exports.run = async (client, message, args) => {
  let error = require('../modules/errorMod.js');
  try {
    let voiceChannels = message.guild.channels.filter(channel => channel.type === 'voice');
    let sourceVoiceChannel = voiceChannels.find('name', `${message.member.voiceChannel.name}`);
    let isMod = require('../modules/isMod.js');

    if (isMod(message.author, message)) {
      let sourceVoiceChannelMember = sourceVoiceChannel.members.array();
      for (let member of sourceVoiceChannelMember) {
        {

          await member.setMute(false, `${message.author.tag} used unmuteall command.`).catch((e) => console.error(e));

        }
      }
      message.react('👌');

    }
  } catch (e) {
    let error = require('../modules/errorMod.js');
    error("You either are not in a voice channel, don't have the correct permissions or messed up badly!", message)
    console.error(e);
  }


}
