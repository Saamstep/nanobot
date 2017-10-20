exports.run = (client, message, args) => {
  let type = args[0];
  let f1 = args[1];
  let f2 = args[2];
  let f3 = args[3];
  let guild = message.guild;
  let pollchannel = guild.channels.find("name", "poll");


  if (type == 2) {
    message.delete(0);
    pollchannel.send("**" + f1 + "** ( :a: ) | **OR** | **" + f2 + "** ( :b: ) _Add a reaction with the right emoji!_ [ @Notifications ]");
  }

  if (type == 3) {
    message.delete(0);
    pollchannel.send("**" + f1 + "** ( :a: ) | **OR** | **" + f2 + "** ( :b: ) | **OR** | **" + f3 + "** ( :regional_indicator_c: ) _Add a reaction with the right emoji!_ [ @Notifications ]").catch(error => console.log(error));
  }

  if (type == 0) {
    message.delete(0);
    pollchannel.send("**" + f1 + "** ( :a: ) | **OR** | **" + f2 + "** ( :b: ) | **OR** | **BOTH** ( :ab: ) _Add a reaction with the right emoji!_ [ @Notifications ]").catch(error => console.log(error));
  }


};
