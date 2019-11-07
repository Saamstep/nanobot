exports.run = (client, message, args, veriEnmap, cc) => {
  const schedule = require('node-schedule');
  const listTeams = ['OW Blue', 'OW White', 'RL Blue', 'RL White'];
  var day = Date.now();
  // var date = new Date(args[0] + `/${now.getFullYear}`);
  // console.log(date);
  let team = `${args[0]} ${args[1]}`;
  // let day = '';
  let time = '';
  if (listTeams.indexOf(team) == -1) {
    console.log(team);
    return client.error(`Please select an active team!\n\`\`\`${listTeams.join('\n')}\`\`\``, message);
  }
  async function cmd() {
    await message.channel.send('Please input the day of the match');
    await message.channel
      .awaitMessages(response => response.author.id == message.author.id, {
        max: 1,
        errors: ['time']
      })
      .then(collected => {
        day += collected.first();
      })
      .catch(() => {
        message.channel.send('There was no date inputed within the time limit!');
      });
    await message.channel.send('Input the time');
    await message.channel
      .awaitMessages(response => response.author.id == message.author.id, {
        max: 1,
        errors: ['time']
      })
      .then(collected => {
        time += collected.first();
      })
      .catch(() => {
        message.channel.send('There was no time inputed within the time limit!');
      });
    await console.log(day + time);
    await day.set;
  }
  cmd();
};

exports.cmd = {
  enabled: true,
  category: 'VCHS Esports',
  level: 3,
  description: 'Schedule matches with reminders!'
};
