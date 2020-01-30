exports.run = (client, sendMessage, member) => {
  const fs = require("fs");
  const readline = require("readline");
  const { google } = require("googleapis");
  // If modifying these scopes, delete token.json.
  const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];
  // The file token.json stores the user's access and refresh tokens, and is
  // created automatically when the authorization flow completes for the first
  // time.
  const TOKEN_PATH = "../token.json";

  // Load client secrets from a local file.
  fs.readFile("credentials.json", (err, content) => {
    if (err) return console.log("Error loading client secret file:", err);
    // Authorize a client with credentials, then call the Google Sheets API.
    authorize(JSON.parse(content), findDiscord);
  });

  function authorize(credentials, callback) {
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) return getNewToken(oAuth2Client, callback);
      oAuth2Client.setCredentials(JSON.parse(token));
      callback(oAuth2Client);
    });
  }

  function getNewToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES
    });
    console.log("Authorize this app by visiting this url:", authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.question("Enter the code from that page here: ", code => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error("Error while trying to retrieve access token", err);
        oAuth2Client.setCredentials(token);

        fs.writeFile(TOKEN_PATH, JSON.stringify(token), err => {
          if (err) return console.error(err);
          console.log("Token stored to", TOKEN_PATH);
        });
        callback(oAuth2Client);
      });
    });
  }

  function findDiscord(auth) {
    const sheets = google.sheets({ version: "v4", auth });
    let found = false;
    sheets.spreadsheets.values.get(
      {
        spreadsheetId: "1eAXCsCxEw1uH-_Wk5oF0tmK5xBYV1dmxMqPo0kq2Z6Y",
        range: "Form Responses 1!B2:E"
      },
      (err, res) => {
        if (err) return client.error("The API returned an error: " + err, "error", "Verification");
        const rows = res.data.values;
        if (rows.length) {
          rows.map(row => {
            // row[0] = name
            // row[1] = email
            // row[2] = discordtag
            // row[3] = class
            if (row[2] == `${member.user.username}#${member.user.discriminator}`) {
              found = true;
              const guild = client.guilds.get(client.ConfigService.config.guild);
              member.addRole(guild.roles.find(role => role.name == row[3]));
              member.addRole(guild.roles.find(role => role.name == client.ConfigService.config.roles.iamRole));
              member.setNickname(`${member.user.username} (${req.body.name})`);
              member.send({
                embed: {
                  description: `Welcome back! You have been re-verified sucessfully in the **${guild.name}** official Discord server. Here is your info for confirmation. Remember to read <#476920535520116736> for more server info!`,
                  color: 2582446,
                  footer: {
                    text: "VCHS Esports Verification"
                  },
                  author: {
                    name: "Re-Verification Confirmation",
                    icon_url: client.user.avatarURL
                  },
                  image: {
                    url: guild.splashURL
                  },
                  fields: [
                    {
                      name: "Name",
                      value: row[0]
                    },
                    {
                      name: "Discord",
                      value: row[2]
                    },
                    {
                      name: "Email",
                      value: row[1]
                    },
                    {
                      name: "Class",
                      value: row[3]
                    }
                  ]
                }
              });
              sendMessage("general", `✅ **${member.user.username}** is now re-verified, welcome back!`);
              return;
            }
          });
          if (!found) {
            return member.send("You are not verified! Please verify with the Google form: http://discord.vchsesports.net. Verification gives you access to all text and voice channels!");
          }
        } else {
          client.console("This is bad, the google sheet has no data!", "error", "Verification");
        }
      }
    );
  }
};
