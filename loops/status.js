let init = 0;
exports.run = async (client, dupe, sendMessage) => {
  let status = client.ConfigService.config.status;
  await client.user.setPresence({
    game: { name: `${client.ConfigService.config.status[init]}`, type: 0 }
  });

  init++;
  if (init >= status.length) init = 0;
};

exports.time = 60000;
