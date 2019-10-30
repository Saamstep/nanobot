exports.run = async (client, message, args) => {
  const fetch = require('node-fetch');

  let uuid = '';
  try {
    const response = await fetch(`https://api.mojang.com/users/profiles/minecraft/${args[0]}`);
    const body = await response.json();
    uuid = body.id;
  } catch (e) {
    return;
  }

  try {
    const response2 = await fetch(`https://api.mojang.com/user/profiles/${uuid}/names`);
    const body = await response2.json();
    let msg = `**Username History for \`${args[0]}\`**\n`;
    for (let j in body) {
      msg += `- ${body[j].name}\n`;
    }
    message.channel.send(msg);
  } catch (e) {
    return;
  }
};

exports.cmd = {
  enabled: true,
  category: 'Games',
  level: 0,
  description: 'Lookup Minecraft username history'
};
