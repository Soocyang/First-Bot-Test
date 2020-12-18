const Discord = require('discord.js');

module.exports = {
    name: 'admhelp',
    description: 'Admin help',
    execute(msg, client){
        const embed = new Discord.MessageEmbed()
                        .setAuthor(client.user.username, client.user.displayAvatarURL())              
                        .setColor(0x3ba3ee)
                        .setTitle('Help? NO')
                        .setDescription('Jk 🌚')
                        .addField('Murrr cmd', 'murrr\nshock\nnoted\nlc\nsad\nomg\nroll\nnoice\nsadED\n忍')
                        .addField('Admin cmd', 'Bulk delete messages e.g. `~clearchat 5` ')
        msg.channel.send(embed);
    }
};