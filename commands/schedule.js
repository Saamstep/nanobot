exports.run = (client, message, args, cc) => {
  //INIT VARS
  const schedule = require("node-schedule");
  let listTeams = ["Rocket League Varsity", "Rocket League JV 1", "OW Varsity", "OW JV 1", "OW JV 2"];
  let now = new Date();
  let year = now.getFullYear();
  let team = `${listTeams[args[0] - 1]}`;
  let type = args[1];
  let day = "";
  let time = "";
  let listOfTeams = "";
  let count = 1;

  //number the teams list
  listTeams.forEach(t => {
    listOfTeams += `[${count}] ${t}\n`;
    count++;
  });

  //error check for args
  if (!args[1] || !team || !args[2]) return client.error(`\`\`\`${client.ConfigService.config.prefix}schedule [team number] [type (scrim/match)] [description]\n--[Team #]--\n${listOfTeams}\`\`\``, message);

  let desc = args
    .join(" ")
    .substring(parseInt(args[0].length + args[1].length + 1), args.join(" ").length)
    .trim();

  //check if team is on list
  if (listTeams.indexOf(team) == -1) {
    return client.error(`Please select an active team! Use the number identifiers.\n\`\`\`${listOfTeams}\`\`\``, message);
  }

  async function cmd() {
    //ask for day
    await message.channel.send(`Please input the day of the ${type} \`ex: ${now.getMonth() + 1}/${now.getDate()}\``);
    await message.channel
      .awaitMessages(response => response.author.id == message.author.id, {
        max: 1,
        time: 30000,
        errors: ["time"]
      })
      .then(collected => {
        day += collected.first();
      })
      .catch(() => {
        return client.error("There was no date inputed within the time limit!", message);
      });
    //asks for time in 24hr format
    await message.channel.send("Input the time (24 hour time format ONLY) `ex: 17:00 (5PM)`");
    await message.channel
      .awaitMessages(response => response.author.id == message.author.id, {
        max: 1,
        time: 30000,
        errors: ["time"]
      })
      .then(collected => {
        time += collected.first();
      })
      .catch(() => {
        return client.error("There was no time inputed within the time limit!", message);
      });
    //convert to timestamp
    let d = `${day}/${year}/${time}`;
    let dArr = d.split("/");
    // NEW TIMESTAMP --> year, month, day, hours, minutes, seconds, miliseconds;
    let ts = new Date(`${dArr[2]}`, `${parseInt(dArr[0] - 1).toString()}`, `${dArr[1]}`, `${dArr[3].split(":")[0]}`, `${dArr[3].split(":")[1]}`, "00");
    //timestamp 1hr before for reminder
    let ts1hr = new Date(`${dArr[2]}`, `${parseInt(dArr[0] - 1).toString()}`, `${dArr[1]}`, `${parseInt(dArr[3].split(":")[0] - 1).toString()}`, `${dArr[3].split(":")[1]}`, "00");
    //Init week/month arrays
    let weeks = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    let months = ["January", "Feburary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    let Fhours = ts.getHours(); // gives the value in 24 hours format
    let AmOrPm = Fhours >= 12 ? "PM" : "AM";
    Fhours = Fhours % 12 || 12;
    let Fminutes = ts.getMinutes();
    if (Fminutes <= 9) Fminutes = "0" + Fminutes;
    let finalTime = Fhours + ":" + Fminutes + " " + AmOrPm;
    let Fday = `${weeks[ts.getDay()]}, ${months[ts.getMonth()]} ${ts.getDate()} at ${finalTime} PST`;

    let embed = {
      description: "Sucessfully created reminder",
      author: {
        name: "Reminder"
      },
      footer: {
        text: `${client.user.username} - Reminders`,
        icon_url: client.user.avatarURL
      },
      color: 9712287,
      fields: [
        {
          name: "Description",
          value: `${desc}`
        },
        {
          name: `Type`,
          value: `${type}`,
          inline: true
        },
        {
          name: `Team`,
          value: `${team}`,
          inline: true
        },
        {
          name: `Day & Time`,
          value: `${Fday}`
        }
      ]
    };
    message.channel.send({ embed });

    function toCasters() {
      embed = {
        description: `A match has been scheduled! If you are avaliable to cast, please contact the captain.`,
        author: {
          name: "Reminder"
        },
        footer: {
          text: `${client.user.username} - Reminders`,
          icon_url: client.user.avatarURL
        },
        color: 9712287,
        fields: [
          {
            name: "Description",
            value: `${desc}`
          },
          {
            name: `Type`,
            value: `${type}`,
            inline: true
          },
          {
            name: `Team`,
            value: `${team}`,
            inline: true
          },
          {
            name: `Day & Time`,
            value: `${Fday}`
          },
          {
            name: `Captain`,
            value: `<@${message.author.id}>`
          }
        ]
      };
      message.guild.channels.find(ch => ch.name == "casters").send(`<@&${message.guild.roles.find(role => role.name == "Casters").id}>`, { embed });
    }

    function toTeam(member) {
      embed = {
        description: `Hey there **${member.nickname}**, this is a reminder for an upcoming event.`,
        author: {
          name: "Reminder"
        },
        footer: {
          text: `${client.user.username} - Reminders`,
          icon_url: client.user.avatarURL
        },
        color: 9712287,
        fields: [
          {
            name: "Description",
            value: `${desc}`
          },
          {
            name: `Type`,
            value: `${type}`,
            inline: true
          },
          {
            name: `Team`,
            value: `${team}`,
            inline: true
          },
          {
            name: `Day & Time`,
            value: `${Fday}`
          },
          {
            name: `Captain`,
            value: `@${message.author.username}`
          }
        ]
      };

      member.send({ embed });
    }

    function teamAnnounce() {
      embed = {
        description: `Hey there ${team} members, this is a reminder for an upcoming event.`,
        author: {
          name: "Reminder"
        },
        footer: {
          text: `${client.user.username} - Reminders`,
          icon_url: client.user.avatarURL
        },
        color: 9712287,
        fields: [
          {
            name: "Description",
            value: `${desc}`
          },
          {
            name: `Type`,
            value: `${type}`,
            inline: true
          },
          {
            name: `Team`,
            value: `${team}`,
            inline: true
          },
          {
            name: `Day & Time`,
            value: `${Fday}`
          },
          {
            name: `Captain`,
            value: `@${message.author.username}`
          }
        ]
      };

      message.guild.channels.find(c => c.name == "team-announcements").send(`<@&${message.guild.roles.find(r => r.name == `${team}`).id}>`, { embed });
    }

    //after command finished
    teamAnnounce();
    message.guild.members.forEach(m => {
      if (m.roles.has(message.guild.roles.find(r => r.name == `${team}`).id)) {
        toTeam(m);
      } else {
        return;
      }
    });
    //scheduled for at time of event
    schedule.scheduleJob(ts, function() {
      message.guild.members.forEach(m => {
        if (m.roles.has(message.guild.roles.find(r => r.name == `${team}`).id)) {
          toTeam(m);
        } else {
          return;
        }
      });
    });

    //schedule 1hour before event
    schedule.scheduleJob(ts1hr, function() {
      message.guild.members.forEach(m => {
        if (m.roles.has(message.guild.roles.find(r => r.name == `${team}`).id)) {
          toTeam(m);
        } else {
          return;
        }
      });
    });
    // if (type == "match") toCasters();
  }

  if (message.member.roles.has(message.guild.roles.find(r => r.name == "Captains").id)) {
    if (args[1] == "scrim" || args[1] == "match") {
      cmd();
    } else {
      return client.error("Invalid type! Please choose **scrim** OR **match**.", message);
    }
  } else {
    return client.error("You need the captains role!");
  }
};

exports.cmd = {
  enabled: true,
  category: "VCHS Esports",
  level: 0,
  description: "Schedule matches and scrims with reminders!"
};
