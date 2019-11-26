exports.run = (client, message, args, veriEnmap, cc) => {
  const schedule = require("node-schedule");
  const listTeams = ["OW Team Blue", "OW Team White", "RL Team Blue", "RL Team White", "LoL Team", "Fortnite Players", "Madden Players", "SSB Ultimate Players", "Minecraft Hunger Games"];
  let year = new Date().getFullYear();
  let now = new Date();
  let team = `${listTeams[args[0] - 1]}`;
  let type = args[1];
  let day = "";
  let time = "";
  let listOfTeams = "";
  let count = 1;
  if (!args[1] || !team) return client.error("```!schedule [team number] [type (scrim/match)]```", message);
  listTeams.forEach(t => {
    listOfTeams += `[${count}] ${t}\n`;
    count++;
  });
  if (listTeams.indexOf(team) == -1) {
    return client.error(`Please select an active team! Use the number identifiers.\n\`\`\`${listOfTeams}\`\`\``, message);
  }

  async function cmd() {
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
    await message.channel.send("Input the time (24 hour time ONLY) `ex: 17:00 `(5PM)");
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
    var d = `${day}/${year}/${time}`;
    let dArr = d.split("/");
    // year, month, day, hours, minutes, seconds, miliseconds;
    let ts = new Date(`${dArr[2]}`, `${parseInt(dArr[0] - 1).toString()}`, `${dArr[1]}`, `${dArr[3].split(":")[0]}`, `${dArr[3].split(":")[1]}`, "00");
    let ts1hr = new Date(`${dArr[2]}`, `${parseInt(dArr[0] - 1).toString()}`, `${dArr[1]}`, `${parseInt(dArr[3].split(":")[0] - 1).toString()}`, `${dArr[3].split(":")[1]}`, "00");

    const embed = {
      description: "",
      author: {
        name: "Reminder"
      },
      footer: {
        text: `${client.user.username} - Reminders`,
        icon_url: client.user.avatarURL
      },
      color: 9712287,
      fields: []
    };
    embed.description = "Sucessfully created reminder";
    embed.fields.push({ name: `Type`, value: `${type}` });
    embed.fields.push({ name: `Team`, value: `${team}` });
    embed.fields.push({ name: `Time of`, value: `${ts}` });
    message.channel.send({ embed });

    embed.fields = [];

    function toCasters() {
      embed.description = `A match has been scheduled! `;
      embed.fields.push({ name: `Type`, value: `${type}` });
      embed.fields.push({ name: `Team`, value: `${team}` });
      embed.fields.push({ name: `Time of event`, value: `${ts}` });
      embed.fields.push({ name: `Sent By`, value: `@${message.author.username}` });
      message.guild.channels.find(ch => ch.name == "casters").send("@Casters", { embed });
    }

    embed.fields = [];

    function toTeam(member) {
      embed.description = `You have an event coming up! Please make sure to be on time.`;
      embed.fields.push({ name: `Type`, value: `${type}` });
      embed.fields.push({ name: `Team`, value: `${team}` });
      embed.fields.push({ name: `Time of event`, value: `${ts}` });
      embed.fields.push({ name: `Sent By`, value: `@${message.author.username}` });
      member.send({ embed });
      message.guild.channels.find(c => c.name == "team-announcements").send(`<@&${message.guild.roles.find(r => r.name == `${team}`).id}>`, { embed });
    }
    embed.fields = [];
    schedule.scheduleJob(ts, function() {
      message.guild.members.forEach(m => {
        if (m.roles.has(message.guild.roles.find(r => r.name == `${team}`).id)) {
          toTeam(m);
        } else {
          return;
        }
      });
    });
    if (type == "match") toCasters();
  }
  if (args[1] == "scrim" || args[1] == "match") {
    cmd();
  } else {
    return client.error("Invalid type! Please choose **scrim** OR **match**.", message);
  }
};

exports.cmd = {
  enabled: true,
  category: "VCHS Esports",
  level: 3,
  description: "Schedule matches with reminders!"
};
