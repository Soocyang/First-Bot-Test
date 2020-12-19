require('dotenv').config()

const Discord = require('discord.js');
const Sequelize = require('sequelize');
const client = new Discord.Client({
    partials: ['MESSAGE'],
});

const PREFIX = '~'
const ROLE_COLOR = {
  sky: '787976983714988042',
  mint: '788222969549684767',
  grape: '788223025824006164',
  peach: '788223196545286214',
  lemon: '788223232373293086',
  orange: '788223321140363276'
}

const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only
	storage: 'database.sqlite',
});


//Create model
const Tags = sequelize.define('tags', {
	name: {
		type: Sequelize.STRING,
		unique: true,
	},
	description: Sequelize.TEXT,
	username: Sequelize.STRING,
	usage_count: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
});


const fs = require('fs');
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for(const file of commandFiles){
  const command = require(`./commands/${file}`);

  client.commands.set(command.name, command);
}

client.once('ready', () => {
  Tags.sync();
})

//Bot activity status
client.on('ready', () => {
  console.log("Bot is ready!!!");
  client.user.setActivity('Mr & Mrs Gao', { type:'WATCHING' });
});

//This when user delete message YELL AT THEM!!!!
// client.on('messageDelete', msg => {
//     // Create the attachment using MessageAttachment
//     const attachment = new Discord.MessageAttachment('https://images-ext-2.discordapp.net/external/gSnYcbkGLhtVvwNloUomWx0762Nnfeduwkembi-SBy0/https/media.discordapp.net/attachments/620183192879628298/735538633255419924/unknown.png');
//     // Send the attachment in the message channel
//     msg.channel.send(attachment);
// });


//Default message reply memes
client.on('message', msg => {
  client.commands.get('defaultCmd').execute(msg);

});

//Useful functions command
client.on('message', msg => {
  if (!msg.content.startsWith(PREFIX) || msg.author.bot) return;
  const args = msg.content.slice(PREFIX.length).trim().split(' ');
  const command = args.shift().toLowerCase();
  if(command === 'args-info'){
    checkArgs(msg, args);
    msg.channel.send(`Command name: ${command}\nArguments: ${args}`);
  }
  else if(command === 'clearchat'){
    checkArgs(msg, args);
    client.commands.get('clearchat').execute(msg, args);
    //clearChat(msg, args);
  }
  else if(command === 'help'){
    client.commands.get('help').execute(msg, client);
  }
  else if(command === 'admhelp'){
    client.commands.get('admhelp').execute(msg, client);
  }
  else if(command === 'avatar'){
    checkArgs(msg, args);
    client.commands.get('avatar').execute(msg, args);
    //avatar(msg);
  }
  else if(command === 'ping'){
    client.commands.get('ping').execute(msg, args);
  }
});


client.on('message', async msg => {

  if (!msg.content.startsWith(PREFIX) || msg.author.bot) return;
  const args = msg.content.slice(PREFIX.length).trim().split(' ');
  const command = args.shift().toLowerCase();


  if (command === 'addtag') {
    const tagName = args[0];
    const tagDescription = args[1];

    try {
      // equivalent to: INSERT INTO tags (name, description, username) values (?, ?, ?);
      const tag = await Tags.create({
    		name: tagName,
    		description: tagDescription,
    		username: msg.author.username,
    	});
    	return msg.reply(`Tag ${tag.name} added.`);
    }
    catch (e) {
    	if (e.name === 'SequelizeUniqueConstraintError') {
    		return msg.reply('That tag already exists.');
      }
      console.log(e);
      return msg.reply('Something went wrong with adding a tag.');
    }


  } else if (command === 'tag') {

    // //This section can be removed
    // // equivalent to: SELECT * FROM tags WHERE name = 'tagName' LIMIT 1;
    // const tag = await Tags.findOne({ where: { name: args[0] } });
    // if (tag) {
    // 	// equivalent to: UPDATE tags SET usage_count = usage_count + 1 WHERE name = 'tagName';
    // 	tag.increment('usage_count');
    // 	return msg.channel.send(tag.get('description'));
    // }
    // return msg.reply(`Could not find tag: ${tagName}`);

  } else if (command === 'edittag') {
    // [zeta]
    const tagName = args[0];
    const tagDescription = args[1];

    // equivalent to: UPDATE tags (description) values (?) WHERE name='?';
    const affectedRows = await Tags.update({ description: tagDescription }, { where: { name: tagName } });
    if (affectedRows > 0) {
    	return msg.reply(`Tag ${tagName} was edited.`);
    }
    return msg.reply(`Could not find a tag with name ${tagName}.`);

  } else if (command === 'taginfo') {
    
    const tagName = args[0];

    // equivalent to: SELECT * FROM tags WHERE name = 'tagName' LIMIT 1;
    const tag = await Tags.findOne({ where: { name: tagName } });
    if (tag) {
    	return msg.channel.send(`${tagName} was created by ${tag.username} at ${tag.createdAt} and has been used ${tag.usage_count} times.`);
    }
    return msg.reply(`Could not find tag: ${tagName}`);
    
  } else if (command === 'showtags') {
    // equivalent to: SELECT name FROM tags;
    const tagList = await Tags.findAll({ attributes: ['name'] });
    const tagString = tagList.map(t => t.name).join(', ') || 'No tags set.';
    return msg.channel.send(`List of tags: ${tagString}`);

  } else if (command === 'removetag') {
    const tagName = args[0];
    // equivalent to: DELETE from tags WHERE name = ?;
    const rowCount = await Tags.destroy({ where: { name: tagName } });
    if (!rowCount) return message.reply('That tag did not exist.');

    return msg.reply('Tag deleted.');

  }

});


client.on('message', async msg => {
  if (!msg.content.startsWith(PREFIX) || msg.author.bot) return;
  const args = msg.content.slice(PREFIX.length).trim().split(' ');
  const command = args.shift().toLowerCase();

  // equivalent to: SELECT * FROM tags WHERE name = 'tagName' LIMIT 1;
  try{
    const tag = await Tags.findOne({ where: { name: command } });
    if (tag) {
      // equivalent to: UPDATE tags SET usage_count = usage_count + 1 WHERE name = 'tagName';
      tag.increment('usage_count');
      return msg.channel.send(tag.get('description'));
  }
  }catch(e){
    console.log(e);
    return msg.reply(`Could not find tag: ${command}`);
  }
});





function checkArgs(msg, args){
  if (!args.length) {
    return msg.channel.send(`You didn't provide any arguments, ${msg.author}!`);
  }
}

//This function is to let user get role
function modUser(msg, color){
  for(let key in ROLE_COLOR){
    if (color[0] === `${key}`) {
      msg.member.roles.add(ROLE_COLOR[key])
    }
  }
}

/**Testing-Playground**/

//Login bot
client.login(process.env.BOT_TOKEN);

