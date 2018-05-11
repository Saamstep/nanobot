exports.run = (client, message, args) => {
  let type = args[0];
  let f1 = args[1];
  let f2 = args[2];
  let f3 = args[3];
  let guild = message.guild;
  const config = require('../config.json');
  let pollchannel = guild.channels.find('name', `${config.pollchannel}`);

  if (type == null) {
    message.channel.send(
      `${
        config.prefix
      }qotd [0/2/3] [option1] [option2] [option3 (only for #3)]\n0 - 2 options to choose from along with a BOTH option.\n2 - 2 options to choose from.\n3 - 3 options to choose from.`,
      { code: 'aciidoc' }
    );
  }

  if (type == 2) {
    message.delete(0);
    pollchannel.send(
      '**' +
        f1 +
        '** ( :a: ) | **OR** | **' +
        f2 +
        '** ( :b: ) _Add a reaction with the right emoji!_'
    );
  }

  if (type == 3) {
    message.delete(0);
    pollchannel
      .send(
        '**' +
          f1 +
          '** ( :a: ) | **OR** | **' +
          f2 +
          '** ( :b: ) | **OR** | **' +
          f3 +
          '** ( :regional_indicator_c: ) _Add a reaction with the right emoji!_'
      )
      .catch(error => console.log(error));
  }

  if (type == 0) {
    message.delete(0);
    pollchannel
      .send(
        '**' +
          f1 +
          '** ( :a: ) | **OR** | **' +
          f2 +
          '** ( :b: ) | **OR** | **BOTH** ( :ab: ) _Add a reaction with the right emoji!_'
      )
      .catch(error => console.log(error));
  }
};

exports.description = 'Allows you to ask a formatted question of the day.';
