exports.run = (client, message, args) => {
  let guild = message.guild;
  const role = message.guild.roles.find('name', `${args[2]}`);
  let user = message.guild.member(message.mentions.users.first());
  console.log(user + "\n\n" + role)

  message.guild.member(user).addRole(role.id);

}

exports.description = "Allows mods to add role to a user."
