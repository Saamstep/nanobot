exports.run = (client, message, args, veriEnmap) => {
 if(client.isMod(message.author, message)) {
    let member = message.mentions.users.first();
    let roleUser = message.guild.members.get(member.id);
    switch(args[0]) {
        case "clearALL_dangerous_be_careful":
                veriEnmap.defer.then(() => {
                    veriEnmap.deleteAll();
                    message.channel.send('Cleared verification enmap');
                  });
             client.log('All Data Deleted', `Yea... its all gone :|`, 2942691, message, client);     
            break;
        case "addrole":
            if(!args[1]) return;
            roleUser.addRole(message.guild.roles.find(r => r.name === `${args[2]}`))
             veriEnmap.push(`${member.id}`, `${args[2]}`, 'roles');
             message.channel.send(`Updated ${member.username}.`);
             client.log('Role Added to User', `${member} now has role \`${args[2]}\``, 2942691, message, client);
             break;
        case "removerole":
            if(!args[1]) return;
            roleUser.removeRole(message.guild.roles.find(r => r.name === `${args[2]}`))
            veriEnmap.remove(`${member.id}`, `${args[2]}`, 'roles');
            message.channel.send(`Updated ${member.username}.`);
            client.log('Role Removed from User', `${member} now does not have role \`${args[2]}\``, 2942691, message, client);
             break;
         case "updatename":
             veriEnmap.set(`${member.id}`,`${args[2]} ${args[3]}`, 'name');
             roleUser.setNickname(`${args[2]} ${args[3]}`);
             message.channel.send(`Updated ${member.username}.`);
             client.log('User\'s Name Updated', `${member} now is named ${args[2]} ${args[3]}`, 2942691, message, client);
            break;
        case "seedata":
                veriEnmap.defer.then(() => {
                    if (!args[0]) {
                      const embed = {
                        color: 16239504,
                        author: {
                          name: `${message.author.username}'s Data`,
                          avatar_url: `${message.author.avatarURL}`
                        },
                        fields: [
                          {
                            name: 'Name',
                            value: `${veriEnmap.get(`${message.author.id}`, 'name')}`
                          },
                          {
                            name: 'Discord',
                            value: `${message.author.username}#${message.author.discriminator}`
                          },
                          {
                            name: 'Email',
                            value: `${veriEnmap.get(`${message.author.id}`, 'email')}`
                          },
                          {
                            name: 'Roles',
                            value: `${veriEnmap.get(`${message.author.id}`, 'roles').join('\n')}`
                          }
                        ]
                      };
                      message.author.send({ embed });
                    } else {
                      var member = message.mentions.users.first();
                      const embed = {
                        color: 16239504,
                        author: {
                          name: `${member.username}'s Data`,
                          avatar_url: `${member.avatarURL}`
                        },
                        fields: [
                          {
                            name: 'Name',
                            value: `${veriEnmap.get(`${member.id}`, 'name')}`
                          },
                          {
                            name: 'Discord',
                            value: `<@${member.id}>`
                          },
                          {
                            name: 'Email',
                            value: `${veriEnmap.get(`${member.id}`, 'email')}`
                          },
                          {
                            name: 'Roles',
                            value: `${veriEnmap.get(`${member.id}`, 'roles').join('\n')}`
                          }
                        ]
                      };
                      if (client.isMod(message.author, message)) return message.author.send({ embed });
                    }
                  });
            break;      
            default:
                message.channel.send(`\`\`\`${client.ConfigService.config.prefix}verify [clearALL_dangerous_be_careful/addrole/removerole/updatename/seedata] [user] [new]\`\`\``);
    }
 }
}