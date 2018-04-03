var data2 = [];
for (var i = 0; i < compareTeams.length; i++) {
  const team = compareTeams[i];
  Meteor.call(
    'scouting.getByEventAndTeam',
    '2018cada',
    team.key,
    (err, teamData) => {
      var switchAutoCount = 0;
      for (var j = 0; j < teamData.length; j++) {
        switchAutoCount += teamData[j].data.auto.blocksPlaced.switch;
      }
      data2.push({ teamKey: team.key, switchCount: switchAutoCount });
      console.log(JSON.stringify(data2));
    }
  );
  if (i == compareTeams.length - 1) {
    console.log(JSON.stringify(data2));
  }
}
