exports.run = (client, message, args) => {
  const error = require('../modules/errorMod.js');
  const guild = message.guild;
  const logEvent = require('../modules/logMod.js');

  if (!message.guild.me.hasPermission(['MANAGE_CHANNELS', 'MOVE_MEMBERS'])) {
    return error('Missing the required `Manage Channels` and `Move Members` permissions.', message);
  }

  // Get the mentioned user/bot and check if they're in a voice channel:
  const user = message.mentions.users.first();

  if (client.isAdmin(message.author, message, true, client)) {
    async function cmd() {
      const member = message.mentions.members.first();
      if (!member) {
        return message.reply('You need to @mention a user/bot to kick from the voice channel.');
      }
      if (!member.voiceChannel) {
        return message.reply("That user/bot isn't in a voice channel.");
      }

      // Now we make a temporary voice channel, move the user/bot into the channel, and delete it:
      const temp_channel = await message.guild.createChannel(user.id, 'voice', [
        { id: guild.id, deny: ['VIEW_CHANNEL', 'CONNECT', 'SPEAK'] },
        { id: member.id, deny: ['VIEW_CHANNEL', 'CONNECT', 'SPEAK'] }
      ]);
      await member.setVoiceChannel(temp_channel);

      await temp_channel.delete();

      // Finally, pass some user response to show it all worked out:
      message.react('👌');
      logEvent('User Booted', `${user} was booted from a voice channel!`, 65380, message, client);
    }
    cmd();
  }
};
exports.description = 'Allows admins to boot users from the voice channel.';
