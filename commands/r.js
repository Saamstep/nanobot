exports.run = async (client, message, args) => {



  const embed = {
    "description": `\`\`\`message goes here\`\`\``,
    "timestamp": Date.now(),
    "footer": {
      "icon_url": "https://cdn.discordapp.com/embed/avatars/0.png"
    },
    "author": {
      "name": "Reply to <@user>"
    },
    "fields": []
  };

  let msg = message.channel.fetchMessage(`${args[0]}`)
  .then(msg => message.channel.send(msg.content))
  .catch(console.error);



};