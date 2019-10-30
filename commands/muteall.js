exports.run = async (client, message, args) => {
  let error = require('../modules/errorMod.js');
  try {
    let voiceChannels = message.guild.channels.filter(channel => channel.type === 'voice');
    let sourceVoiceChannel = voiceChannels.find('name', `${message.member.voiceChannel.name}`);
    let isMod = require('../modules/isMod.js');

    if (isMod(message.author, message, client)) {
      let sourceVoiceChannelMember = sourceVoiceChannel.members.array();
      for (let member of sourceVoiceChannelMember) {
        {
          if (member.id !== message.author.id) {
            await member.setMute(true, `${message.author.tag} used muteall command.`).catch(e => console.error(e));
          }
        }
      }
      message.react('👌');
    }
  } catch (e) {
    let error = require('../modules/errorMod.js');
    error("You either are not in a voice channel, don't have the correct permissions or messed up badly!", message);
    console.error(e);
  }
};
exports.cmd = {
  enabled: true,
  category: 'Moderation',
  level: 1,
  description: 'Allows mods to mute all user (except person who ran the command in current voice channel'
};
