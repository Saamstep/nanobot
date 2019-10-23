exports.run = (client, message, args, veriEnmap, cc) => {
  const dateFormat = require('dateformat');
  let user = message.mentions.members.first() || message.member;
  const defaultProfile = {
    bio: 'Hello there.',
    socials: ['[Google+](https://google.com)']
  };
  var bio;
  var teams = [];
  var socials;

  let allTeams = ['OW Team Blue', 'OW Team White', 'RL Team Blue', 'RL Team White'];

  veriEnmap.defer.then(() => {
    if (veriEnmap.has(user.id)) {
      if (veriEnmap.has(user.id, 'profile')) {
        bio = veriEnmap.get(user.id, 'profile.bio');
        socials = veriEnmap.get(user.id, 'profile.socials').join('\n');
      } else {
        bio = defaultProfile.bio;
        socials = defaultProfile.socials.join('\n');
      }
    } else {
      client.error('You are not verified, please fill out the Discord verification form.', message);
    }
    user.roles.forEach(r => {
      if (allTeams.indexOf(r.name) > -1) {
        teams.push(`${r.name}`);
      }
    });
    let joined = dateFormat(user.joinedAt, 'mmmm dS, yyyy h:MM:ss TT');
    let age = dateFormat(user.user.createdAt, 'mmmm dS, yyyy h:MM:ss TT');
    const embed = {
      color: 10644181,
      footer: {
        icon_url: `${client.user.avatarURL}`,
        text: 'Profiles'
      },
      author: {
        name: `${user.user.username} | ${veriEnmap.get(user.id, 'name')}`,
        icon_url: `${user.user.avatarURL}`
      },
      fields: [
        {
          name: 'Bio',
          value: bio
        },
        {
          name: 'Teams',
          value: teams.join('\n') || 'No teams'
        },
        {
          name: 'Socials',
          value: socials
        },
        {
          name: 'Account Age',
          value: age,
          inline: true
        },
        {
          name: 'Joined',
          value: joined,
          inline: true
        }
      ]
    };
    message.channel.send({ embed });
  });
};
