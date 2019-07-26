exports.run = (client, owl, youtube, twitch, veriEnamp, sendMessage) => {
  const fs = require('fs');

  function sendAuthEmail(email, name, discorduser) {
    //nodemail
    var nodemailer = require('nodemailer');
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: ConfigService.config.mail.user,
        pass: ConfigService.config.mail.pass
      }
    });
    //add discord invite to html
    fs.readFile('./html/confirm.html', 'utf8', function(err, data) {
      if (err) {
        return console.log(err);
      }
      let result = data.replace(/NAME/g, name).replace(/DISCORDUSER/g, discorduser);

      var mailOptions = {
        from: 'DiscordBot',
        to: `${email}`,
        subject: 'Discord Server Verification',
        html: `${result}`
      };

      // finally sends the email to the user with the code so they know what it is!
      transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
          client.console(error);    
        } else {
          client.console('Email sent: ' + info.response);
          sendMessage(
            `${client.ConfigService.config.channel.log}`,
            `Email sent to ${name} (${discorduser}) with the email adress ${email} for server verification.`
          );
        }
      });
    });
  }

  function sendErrorEmail(email, name, errormsg) {
    //nodemail
    var nodemailer = require('nodemailer');
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: ConfigService.config.mail.user,
        pass: ConfigService.config.mail.pass
      }
    });

    //add discord invite to html
    fs.readFile('./html/error.html', 'utf8', function(err, data) {
      if (err) {
        return console.log(err);
      }
      let result = data.replace(/NAME/g, name).replace(/ERROR/g, errormsg);

      var mailOptions = {
        from: 'DiscordBot',
        to: `${email}`,
        subject: 'Discord Server Verification',
        html: `${result}`
      };

      // finally sends the email to the user with the code so they know what it is!
      transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
          client.console(error);
        } else {
          client.console('Email sent: ' + info.response);
        }
      });
    });
  }

  //TypeForm Responses Webhook server
  function typeFormServer() {
    const http = require('http');
    var options = {
      key: fs.readFileSync('./https/key.pem'),
      cert: fs.readFileSync('./https/cert.pem'),
      method: 'POST',
      path: '/typeform'
    };
    client.console('HTTP Server | Listening for requests'.red);
    http
      .createServer(options, function(req, res) {
        let body = '';
        req.setEncoding('utf8');
        req.on('data', function(chunk) {
          body += chunk;
        });
        req.on('end', function() {
          if (body) {
            client.console('Crypto | Verified');
            let data = JSON.parse(body);
            console.log(data);

            let discordusser = data[2].answer; //discord username
            let discordid = client.users.find(user => user.username + '#' + user.discriminator == `${discorduser}`);

            let email = data[1].answer; //email
            let name = data[0].answer; //name
            veriEnmap.defer.then(() => {
              sendAuthEmail(email, name, discorduser);
              client.console(`Auth email sent to ${email}`);
              veriEnmap.defer.then(() => {
                veriEnmap.set(`${discordid.id}`, {
                  name: `${name}`,
                  email: `${email}`,
                  roles: data[3].answer
                });

                discordid.send(
                  `You have been sucessfully verified in the Discord server. If you believe this was an error email us at vchsesports@gmail.com\n\nConfirmation Info:\n\`\`\`Discord: ${discorduser}\nEmail: ${veriEnmap.get(
                    discordid.id,
                    'email'
                  )}\`\`\``
                );
                let guild = client.guilds.get(`${client.ConfigService.config.guild}`);
                let join = guild.channels.find(jn => jn.name === `${ConfigService.config.channel.joinCh}`);
                join.send(`✅ **${discordid.username}** has been verified, welcome ${name}.`);
                console.log(
                  `set enmap data\n${name}\n${email}\n${discordid.username}\nwith given username: ${discorduser}`
                );
                let addRole = guild.roles.find(r => r.name === `${client.ConfigService.config.roles.iamRole}`);
                //if they dont have default role, run commands
                if (
                  !guild.member(discordid.id).roles.find(r => r.name === `${client.ConfigService.config.roles.iamRole}`)
                ) {
                  // add the roles
                  guild.members
                    .get(discordid.id)
                    .addRole(addRole)
                    .catch(console.error);
                  // set nickname
                  guild.members
                    .get(discordid.id)
                    .setNickname(`${veriEnmap.get(`${discordid.id}`, 'name')}`, 'Joined server.');
                  client.console('Updated user: ' + discorduser);
                  veriEnmap.get(discordid.id, 'roles').forEach(function(choice) {
                    let role = guild.roles.find(r => r.name === `${choice}`);
                    guild.members.get(discordid.id).addRole(role);
                  });
                }
              });
            });
            res.end('<h1>Complete</h1>');
          } else {
            client.console('Crypto | Invalid Signature');
            return res.end('<h1>Error</h1>');
          }
        });
      })
      .listen(3000);
  }
  typeFormServer();
};
