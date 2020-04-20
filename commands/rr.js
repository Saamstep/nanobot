exports.run = (client, message, args) => {
  let guild = message.guild;
  let user = message.guild.member(message.mentions.users.first());
  let string = `${args.join(" ").replace(user, "")}`;
  string = string.trim();
  let role = message.guild.roles.find((r) => r.name == `${args.join(" ").replace(args[0], "").trim()}`);

  if (message.mentions.users.size === 0) {
    message.delete(0);
    return client.error("Please mention a user", message).catch((err) => console.error);
  }
  if (!user.roles.has(role.id)) {
    return client.error("This user does not have that role!", message);
  }
  message.delete(0);
  user.removeRole(role);
  message.channel.send(`**-** ${role.name} for user sucessfully!`);
};
exports.cmd = {
  enabled: true,
  category: "Admin",
  level: 2,
  description: "Allows admins to remove role from a user.",
};
