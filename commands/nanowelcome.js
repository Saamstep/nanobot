exports.run = (client, message, args) => {
  const embed = {
    "color": 1072551,
    "author": {
      "name": "Welcome to the Nano SMP Discord!",
      "icon_url": "http://i.imgur.com/n9leIMl.png"
    },
    "image": {
      "url": "http://i.imgur.com/i6PpUwX.png"
    },
    "fields": [
      {
        "name": "Links:",
        "value": "[What is NanoSMP?](https://drive.google.com/open?id=1RZLc2B35duMIJHJuV2FfbKPzu4Vr7abdotegZLToI8I)\n[Nano Discord](http://www.discord.io/nanosmp)\n[Rules](https://drive.google.com/open?id=1WHQQYBmkBYdJWvbrjalUfpOaU9tPPNlc3v0un03lHC0)\n[Application](https://goo.gl/forms/7erV0nUoZn9xb2l82)\n[Other Info](https://drive.google.com/open?id=0Bxj3em0rzxzHc1J6Ty1zZDJscjQ)"
      },
      {
        "name": "FAQ",
        "value": "Can my friend Join? - They must [apply](https://goo.gl/forms/7erV0nUoZn9xb2l82)!\n\nWho owns the server? - Server is kindly hosted by [Samstep](http://twitter.com/saamstep) but the SMP is managed by the 3 managers and new ideas are voted by the community!\n\nCAN WE ADD PLUGINS?!?!?!? - No... We want to keep the server as simple as possible so for now it will be vanilla and controlled by command blocks.\n\nWhat commands are on the server? - Do `/trigger <then click tab>` to see what u can do! once a word pops up add `set 1` after. Ex: `/trigger hello set 1`."
      },
      {
        "name": "Discord Commands",
        "value": "!joined - Shows when you joined the server\n!nanostatus - Shows the status of the server (not always accurate)\n!status <serverIp> - Shows the status of another server (caps matter)\n!choose <1> <2> - Choose between two different things \n!flip - Flip a coin\n!bot - Returns bot creator\n!random - Returns a random number between 1 and 100\n!report types - What you can report a user for | !report @Username <#>"
      }
    ]
  };
  if (message.author.id !== '136637808063414272') {
    return;
  } else {
    message.channel.send({ embed });
  }
};
