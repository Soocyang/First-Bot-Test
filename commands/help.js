const Discord = require('discord.js');

module.exports = {
    name: 'help',
    description: 'HELP!',
    execute(msg, client){
        const embed = new Discord.MessageEmbed()
                        .setAuthor(client.user.username, client.user.displayAvatarURL())              
                        .setColor(0x3ba3ee)
                        .addField('Murrr cmd', 'murrr\nshock\nnoted\nlc\nsad\nomg\nroll\nnoice\nsadED\n忍')
        msg.channel.send(embed);
    }
};