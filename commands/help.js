const Discord = require('discord.js');

module.exports = {
    name: 'help',
    description: 'HELP!',
    execute(msg, client){
        const embed = new Discord.MessageEmbed()
                        .setColor(0x3ba3ee)
                        .setAuthor(client.user.username, client.user.displayAvatarURL())
                        .setTimestamp()              
                        .setDescription(
                            'Need help? Here it is.\n\n' + 
                            '**Commands**\n\n' +
                            '**Tags**\n' +
                            '`~tag add [name] [description]` to **Add** tag \n' + 
                            '`~tag edit [name] [description]` to **Edit** tag \n' +
                            '`~tag info [name]` to **Show** tag **info** \n' + 
                            '`~tag remove [name]` to **Remove** tag \n' + 
                            '`~tag list` to **show all** tags list \n\n');
        msg.channel.send(embed);
    }
};