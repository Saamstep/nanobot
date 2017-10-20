exports.run = (client, message, args) => {
  const ytdl = require("ytdl-core");
  const voiceChannel = message.member.voiceChannel;
  const ffmpeg = require("ffmpeg");
  if (!voiceChannel) return message.reply(":no_entry_sign: | Error. You must be in a voice channel!");
  voiceChannel.join()
    .then(connnection => {
      const stream = ytdl("https://www.youtube.com/watch?v=VMnu6RB7QgQ", { filter: "audioonly"});
      const dispatcher = connnection.playStream(stream);
      dispatcher.on("end", () => voiceChannel.leave());
    });
};
