exports.run = (client, message, args, veriEnmap, cc) => {
  //   const fs = require('fs');
  //   // let obj = '';
  //   // for (i in settings) {
  //   //   let set = settings[i];
  //   //   if (i == 'token' || i == 'apis') continue;
  //   //   if (typeof settings[i] == 'object') {
  //   //     for (var prop in set) {
  //   //       if (Array.isArray(set[prop])) {
  //   //         obj += set[prop].join(', ') + '\n';
  //   //         console.log('is array.');
  //   //       } else {
  //   //         obj += `${prop} > ${set[prop]}\n`;
  //   //       }
  //   //     }
  //   //   } else {
  //   //     obj += `${i} :: ${settings[i]}\n`;
  //   //   }
  //   // }
  //   // console.log(obj);
  //   // message.channel.send(obj);
  //   let set = JSON.parse(fs.readFileSync('./config.json'));
  //   let msg = '';
  //   for (var prop in set) {
  //     if (prop == 'token' || prop == 'apis' || prop == 'mail') continue;
  //     if (typeof set[prop] === 'object') {
  //       for (var type in set[prop]) {
  //         if (msg.includes(prop)) {
  //           msg += `${type} :: ${Object.values(prop)}\n`;
  //         } else {
  //           msg += `\n= ${prop} =\n${type} :: ${Object.values(type)}\n`;
  //         }
  //       }
  //     } else {
  //       msg += `${prop} :: ${JSON.stringify(set[prop])}\n`;
  //     }
  //   }
  //   const helpMsg = `= Help =\n- Variables\nUSER :: Username of user referencing\nSERVER :: The server's name.\nNot avaliable for all settings.\n-----------------`;
  //   message.channel.send(`\`\`\`asciidoc\n${helpMsg}\n${msg}\`\`\``);
  //   console.log(helpMsg + '\n' + msg);
  message.channel.send('I hate JSON objects.');
};
exports.cmd = {
  enabled: false,
  category: 'Admin',
  level: 3,
  description: 'Enmap config system that will not be used'
};
