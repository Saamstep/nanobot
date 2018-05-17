const config = require('../config.json');

exports.run = (client, message, args) => {
  message.channel.startTyping();

  let reportedUser = message.mentions.users.first();
  let guild = message.guild;
  let reportOptions = args[0];
  let reportType = args[1];
  let modchannel = guild.channels.find("name", `${config.log}`);
  let reportReason = ["Bullying/Harrasment", "Racism", "Blackmail", "Inapropriate DMs", "Spam", "Advertising", "Bad Attitude"];
  let reportTypeConverted = reportReason[+ reportType - 1];
  const logEvent = require('../modules/logMod.js');
  const errorMod = require('../modules/errorMod.js');
  var reportSys = function (reportedUser, reportType) {
    logEvent("User Reported", `**${reportedUser}** was reported for **${reportTypeConverted}**`, 0x8B0000, message)
  };

  /*  if (!reportedUser) {
      return message.reply(":no_entry_sign: | That user does not seem valid");
    } */
  if (reportType > 7) {
    message.delete(0);
    message.channel.send("`" + reportType + "` is not a correct report! Do \`" + config.prefix + "report types\` to see options.").then(setTimeout(function (sentMessage) { sentMessage.delete(0) }, 3000)).catch(err => console.error);
    message.channel.stopTyping();
  }
  if (reportOptions === "types") {
    message.channel.send('', {
      embed: {
        color: 0x8B0000,
        fields: [{
          name: "Report Types",
          value: `${config.prefix}report [@user] [reason #]\n`
        },
        {
          name: "1",
          value: `Bullying/Harrasment`
        },
        {
          name: "2",
          value: `Racism`
        },
        {
          name: "3",
          value: `Blackmail`
        },
        {
          name: "4",
          value: "Inapropriate DMs"
        },
        {
          name: "5",
          value: "Spam"
        },
        {
          name: "6",
          value: "Advertising"
        },
        {
          name: "7",
          value: "Bad Attitude"
        }
        ],
        footer: {
          icon_url: client.user.avatarURL,
          text: "Abuse of this command may result in punishment."
        }
      }
    }
    );
    message.channel.stopTyping();
  }

  if (reportOptions == null) {
    async function nothing() {
      message.channel.send(`${config.prefix}report types\n${config.prefix}report [@user] [reason #]`, { code: 'aciidoc' });
      await message.channel.stopTyping();
    }
    return nothing();
  }
  //reporter confirmation DM
  if (reportType <= 7) {
    message.delete(0);
    reportSys(reportedUser, reportType);
    message.author.send(":printer: | Your report about " + reportedUser + " for **" + reportTypeConverted + "** has been recived. If the issue does become more serious please Direct message a moderator and report ALL abuse to discord (https://support.discordapp.com/hc/en-us/articles/115002334127-Contacting-Abuse-Support). You can also change your privacy config (https://support.discordapp.com/hc/en-us/articles/217916488-Blocking-Privacy-Settings).");
    message.channel.stopTyping();
  }
};

exports.description = 'Lets you report a user.'
