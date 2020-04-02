exports.run = (client, dupe, sendMessage) => {
  const schedule = require("node-schedule");

  function announcePeriod(period, event) {
    client.guilds
      .get(client.ConfigService.config.guild)
      .channels.find(ch => ch.name == `${client.ConfigService.config.channel.bell}`)
      .bulkDelete(100);
    if (period == null) {
      sendMessage(client.ConfigService.config.channel.bell, `> 🔔 ${event} <@&689634857877372964>`);
    } else {
      sendMessage(client.ConfigService.config.channel.bell, `> 🔔 \`${period}\` period has ${event} <@&689634857877372964>`);
    }
  }

  //First Period Starting
  schedule.scheduleJob("20 9 * * 1-5", function() {
    announcePeriod(null, "School is begining in 10 minutes!");
  });
  schedule.scheduleJob("30 9 * * 1-5", function() {
    announcePeriod("1st", "started.");
  });
  //Second Period Starting
  schedule.scheduleJob("30 10 * * 1-5", function() {
    announcePeriod("2nd", "started.");
  });
  //Second Period Ending
  schedule.scheduleJob("30 11 * * 1-5", function() {
    announcePeriod("2nd", "ended. The scheduled lunch break has begun and is over at `12:00`.");
  });
  //Lunch Break Ending
  schedule.scheduleJob("50 11 * * 1-5", function() {
    announcePeriod(null, "Lunch is over in 10 minutes!");
  });
  //Third Period Starting
  schedule.scheduleJob("0 12 * * 1-5", function() {
    announcePeriod("3rd", "started.");
  });
  //Fourth Period Starting
  schedule.scheduleJob("0 13 * * 1-5", function() {
    announcePeriod("4th", "started.");
  });
  //SCHOOL Period Ending
  schedule.scheduleJob("00 14 * * 1-5", function() {
    announcePeriod(null, "School is over! You did it!");
  });
};
