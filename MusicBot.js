const queue = [];
let playing = false;
const ytdl = require('ytdl-core');
module.exports = {
  getSongInfo: async function(link, msg) {
    let v = await ytdl.getInfo(link);
    // console.log(v);
    let song = {
      title: v.title,
      publisher: v.author.name,
      avatar: v.author.avatar,
      url: link,
      addedBy: msg.author.username
    };
    return song;
  },
  vc: function(msg) {
    if (!msg.member.voiceChannel) {
      return false;
    } else {
      return true;
    }
  },
  next: function(msg) {
    queue.shift();
    msg.member.voiceChannel.join().then(m => {
      msg.channel.send('Joined the voice channel **' + m.channel.name + '**!');
      const stream = ytdl(queue[0].url, { filter: 'audioonly' });
      const dispatcher = m.playStream(stream);
      msg.channel.send('Playing next song. ' + queue[0].title);
      dispatcher.on('end', () => {
        this.next();
      });
    });
  },
  play: function(msg) {
    msg.member.voiceChannel.join().then(connection => {
      console.log(queue[0].url);
      msg.channel.send('Joined the voice channel **' + connection.channel.name + '**');
      const stream = ytdl(queue[0].url, { filter: 'audioonly' });
      const dispatcher = connection.playStream(stream);
      playing = true;
      msg.channel.send(`Now playing ${queue[0].title}`);
      dispatcher.on('end', () => {
        if (queue[1]) {
          queue.shift();
          play(msg);
          // next(msg);
        } else {
          queue.pop();
          playing = false;
          msg.channel.send('Nothing in the queue. Leaving...');
          msg.member.voiceChannel.leave();
        }
      });
    });
  },
  leave: function(msg) {
    msg.member.voiceChannel.leave();
    queue.pop();
  },
  addToQueue: function(msg, song) {
    queue.push(song);
    console.log('Added to queue');
    const embed = {
      title: song.title,
      url: song.url,
      color: 4825592,
      thumbnail: {
        url: `${song.avatar}`
      },
      author: {
        name: 'Music Requested by ' + song.addedBy,
        icon_url: `${msg.author.avatarURL}`
      },
      fields: [
        {
          name: 'Uploaded By',
          value: song.publisher
        },
        {
          name: 'Position',
          value: `${queue.indexOf(song) + 1}`
        }
      ]
    };
    msg.channel.send({ embed });
  },
  getQueue: function(msg) {
    return queue;
  },
  getPlayStatus: function() {
    return playing;
  }
};
