exports.run = async (client, message, args, cc) => {
  async function cmd() {
    const fetch = require("node-fetch");
    const date = require("dateformat");
    async function getUser(name) {
      let url = `https://api.twitch.tv/helix/users?login=${name}`;
      const req = await fetch(url, {
        headers: {
          "Client-ID": `${client.ConfigService.config.apis.twitch}`
        }
      });
      const userData = await req.json();
      return await userData;
    }
    async function isLive(name) {
      const request = await fetch(`https://api.twitch.tv/helix/streams?user_login=${name}`, {
        headers: {
          "Client-ID": `${client.ConfigService.config.apis.twitch}`
        }
      });
      const streamData = await request.json();
      return await streamData;
    }
    async function getGame(game) {
      const re = await fetch(`https://api.twitch.tv/helix/games?id=${game}`, {
        headers: {
          "Client-ID": `${client.ConfigService.config.apis.twitch}`
        }
      });
      const ga = await re.json();
      return await ga;
    }
    switch (args[0]) {
      case "add":
        /*
        if (!args[1]) return client.error("Please specify a streamer to add!", message);
        const userReq = await getUser(args[1]);
        if (userReq.data[0].length < 1) return client.error("That streamer does not exist!", message);
        const addStreamer = await fetch("https://api.twitch.tv/helix/webhooks/hub", {
          method: "POST",
          headers: {
            "Client-ID": `${client.ConfigService.config.apis.twitch}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            "hub.callback": client.ConfigService.config.twitch.dev.callback,
            "hub.mode": "subscribe",
            "hub.topic": "https://api.twitch.tv/helix/streams?user_id=" + userReq.data[0].id,
            "hub.lease_seconds": 864000,
            "hub.secret": client.ConfigService.config.twitch.dev.secret
          })
        }).then(val => {
          // console.log(val);
        });
        // const cb = await addStreamer.text();
        */
        break;
      case "remove":
        break;
      case "list":
        break;
      case "game":
        if (!args[1]) return client.error("Provite a valid game ID!", message);
        let g = await getGame(args[1]);
        if (g.data[0].length < 1) return client.error("That game ID does not exist!", message);
        message.channel.send(`${g.data[0].name}`);
        break;
      case "user":
        if (!args[1]) return client.error("You must provide a Twitch username!", message);
        let user = await getUser(`${args[1]}`);
        if (user.data[0].length < 1) return client.error("That streamer does not exist!", message);
        embed = {
          title: `${user.data[0].display_name} on Twitch`,
          // description: `${user.data[0].title}`,
          url: `https://twitch.tv/${user.data[0].login}`,
          color: 9442302,
          footer: {
            icon_url: client.user.avatarURL,
            text: client.user.username + " - Twitch"
          },
          fields: [
            {
              name: "Type",
              value: `${user.data[0].broadcaster_type.toUpperCase() || "N/A"}`,
              inline: true
            },
            {
              name: "Views",
              value: `${user.data[0].view_count || "0"}`,
              inline: true
            },
            {
              name: "Description",
              value: `${user.data[0].description || "No description set."}`,
              inline: false
            }
          ],
          thumbnail: {
            url: `${user.data[0].profile_image_url}`
          },
          image: {
            url: `${user.data[0].offline_image_url}`
          }
        };
        message.channel.send({ embed });
        break;
      case "live":
        if (!args[1]) return client.error("You must provide a Twitch username!", message);
        let response = await isLive(args[1]);
        if (response.data < 1) return message.channel.send({ embed: { description: `**${args[1]}** is not live!` } });
        else {
          const embed = {
            title: `${response.data[0].user_name} is live on Twitch!`,
            description: `${response.data[0].title}`,
            url: `https://twitch.tv/${response.data[0].user_name}`,
            color: 9442302,
            footer: {
              icon_url: client.user.avatarURL,
              text: client.user.username + " - Twitch"
            },
            fields: [
              {
                name: "Viewers",
                value: `${response.data[0].viewer_count}`,
                inline: true
              },
              {
                name: "Started on",
                value: `${date(response.data[0].started_at, "m/d/yy @ hh:MM TT")}`,
                inline: true
              }
            ],
            image: {
              url: `${response.data[0].thumbnail_url.replace(`{width}`, "1920").replace(`{height}`, "1080")}`
            }
          };
          message.channel.send({ embed });
        }
        break;
      case "clip":
        if (!args[1] || !args[1].includes("https://clips.twitch.tv")) return client.error("Please provide a valid Twitch clip URL!\n`Ex: https://clips.twitch.tv/CovertBlazingNigiriSoBayed`", message);
        //https://clips.twitch.tv/AwkwardHelplessSalamanderSwiftRage
        let id = args[1].slice(24);

        const clipRequest = await fetch("https://api.twitch.tv/kraken/clips/" + id, {
          headers: {
            "Client-ID": client.ConfigService.config.apis.twitch
          }
        });
        const clip = await clipRequest.json();
        if (clip.data < 1 || clip.data == undefined) return client.error(clip.message + " \n`Ex: https://clips.twitch.tv/CovertBlazingNigiriSoBayed`", message);

        // let name = clip.data[0].title;
        // let creator = clip.data[0].creator_name;
        // let bcaster = clip.data[0].broadcaster_name;
        const download = await fetch(`https://clips.twitch.tv/api/v1/clips/${id}/status`);
        const DLfile = await download.json();
        // console.log(fileURL);
        let fileURL = DLfile.quality_options[0].source;
        const embed = {
          description: `[[Click to Download]](${fileURL})`,
          author: {
            name: clip.data[0].title + " - " + clip.data[0].broadcaster_name,
            icon_url: "http://samstep.net/bots/assets/twitch.jpg"
          },
          image: {
            url: clip.data[0].thumbnail_url
          }
        };
        message.channel.send({ embed });
      default:
        if (!args[0]) return client.error(client.ConfigService.config.prefix + "twitch live|clip [user|clip URL (if applicable)]", message);
        break;
    }
  }
  const cooldown = require("../index.js");
  cooldown(message, cmd);
};

exports.cmd = {
  enabled: true,
  category: "Games",
  level: 3,
  description: "Manage Twitch notifiactions"
};
