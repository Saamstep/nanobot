exports.run = (client, message, args) => {
  const ytdl = require("ytdl-core");
  const voiceChannel = message.member.voiceChannel;
  const ffmpeg = require("ffmpeg");
  let song = args[0];
  if (!voiceChannel) return message.reply(":no_entry_sign: | Error. You must be in a voice channel!");
  voiceChannel.join()
    .then(connnection => {
      const stream = ytdl(song, { filter: "audioonly"});
      const dispatcher = connnection.playStream(stream);
      let vcname = VoiceChannel.name;
//      dispatcher.on("start", client.user.setGame("Music"));
      dispatcher.on("end", () => voiceChannel.leave());
    });
};
