exports.run = (client, sendMessage, input) => {
  const fs = require("fs");
  const readline = require("readline");
  const { google } = require("googleapis");
  console.log("running");
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
    let name = "DNE";
    let discord = "DNE";
    sheets.spreadsheets.values.get(
      {
        spreadsheetId: "1eAXCsCxEw1uH-_Wk5oF0tmK5xBYV1dmxMqPo0kq2Z6Y",
        range: "Form Responses 1!B2:E"
      },
      (err, res) => {
        if (err) return console.log("The API returned an error: " + err);
        const rows = res.data.values;
        if (rows.length) {
          rows.map(row => {
            // row[0] = name
            // row[2] == discordtag
            // console.log(row[2]);
            if (row[2] == input) {
              name = row[0];
              discord = row[2];
            }
          });

          if (name == "DNE" || discord == "DNE") {
            console.log("user does not exist");
          } else {
            console.log(name);
          }
        } else {
          // console.log("No data found.");
        }
      }
    );
  }
};
