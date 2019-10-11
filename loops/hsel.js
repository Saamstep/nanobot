exports.run = (client, dupe, sendMessage) => {
  const data = require('../toornament.json');
  const fetch = require('node-fetch');
  client.console(`Getting HSEL tournament announce`);
  //loop through each game
  for (game in data) {
    console.log(`Getting ${game}`);
    //loop through each team per game
    data[game].teams.forEach(async function(team) {
      try {
        //store game variable locally for use later
        let g = game;
        //make request to toornament
        let url = `https://api.toornament.com/viewer/v2/tournaments/${data[game].id}/matches?participant_ids=${team}&sort=latest_results`;
        const request = await fetch(`${url}`, {
          headers: {
            'X-API-Key': `${client.ConfigService.config.apis.toornament}`,
            Range: 'matches=0-1'
          }
        });
        //parse data as match
        const match = await request.json();
        //if not already announced and there is a score then run this code to announce

        if (!dupe.has(`hsel-${match[0].id}`) && match[0].status == 'completed') {
          //let the winner be opponent 2, but if opponent 1 won, set them to winner
          let winner = match[0].opponents[1].participant.name;
          if (match[0].opponents[0].result == 'win') {
            winner = match[0].opponents[0].participant.name;
          }
          //embed message to send to channel
          const embed = {
            description: `\n**${match[0].opponents[0].participant.name}** vs **${match[0].opponents[1].participant.name}**`,
            url: 'https://hsel.org',
            color: 406084,
            footer: {
              icon_url: 'https://storage.googleapis.com/helpdocs-assets/fd6w7MwUpC/logo?t=1508922412243',
              text: 'Powered by toornament.com'
            },
            thumbnail: {
              url: `${data[g].logo}`
            },
            author: {
              name: `HSEL Match - ${g}`,
              icon_url:
                'http://static1.squarespace.com/static/5317bce9e4b06ab557245f78/t/58d9f2b7b3db2b3cb2902007/1490678457096/HSEL+LOGO.png?format=1500w'
            },
            fields: [
              {
                name: 'Score',
                value: `||${match[0].opponents[0].score} - ${match[0].opponents[1].score}||`,
                inline: true
              },
              {
                name: 'Winner',
                value: `||${winner}||`,
                inline: true
              }
            ]
          };
          //send message via function
          sendMessage(client.ConfigService.config.channel.poll, { embed });
          client.console('Sending new match score...');
          //add to set so that we don't loop the same announcement
          dupe.set(`hsel-${match[0].id}`);
        } else {
          //because we already announced OR the score was not inputted. don't do anything!
          client.console(`Already announced hsel-${match[0].id}`);
        }
      } catch (e) {
        //err
        return;
      }
    });
  }
};

exports.time = 5000;
