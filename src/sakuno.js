const axios = require('axios').default;
require('dotenv').config();

// DISCORD LOGIC
const { Client } = require('discord.js');
const client = new Client();
const PREFIX = '/';

client.login(process.env.DISCORDJS_BOT_TOKEN);

// WIP
client.on('guildMemberAdd', (member) => {
  console.log(`a user joins a guild: ${member.tag}`);
  const channel = member?.guild?.channels?.cache.find(r => r.name.toLowerCase() === 'general');
  channel.send(
    `
    welcome ${member?.user?.username}!!\n
    please use one of the following commands:\n
    sakuno-gms {YOUR_IGN}\n
    sakuno-ems {YOUR_IGN}\n
    sakuno-kms {YOUR_IGN}\n
    sakuno-tms {YOUR_IGN}\n
    sakuno-cms {YOUR_IGN}\n
    sakuno-ps {YOUR_IGN}
    `
  );
  console.log(channel);
});

//TODO: add help command and error messages
client.on('message', async (message) => {
  if (message?.author?.bot) return;
  if (message?.content?.startsWith(PREFIX)) {
    const [command, ...args] = message.content
      .toLowerCase()
      .trim()
      .substring(PREFIX.length)
      .split(/\s+/);
    
    if (!is_valid_command(command, args)) return;
    let char_info = undefined;
    
    switch (command) {
      case 'sakuno-gms': 
        char_info = await verify_hayato(args[0], 'gms');
        if (char_info) add_role(message, char_info?.server);
        break;
      case 'sakuno-ems':
        char_info = await verify_hayato(args[0], 'ems');
        if (char_info) add_role(message, char_info?.server);
        break;
      case 'sakuno-ps':
        add_role(message, 'Private Server');
        break;
      case 'sakuno-cms':
        add_role(message, 'CMS');
        break;
      case 'sakuno-kms':
        add_role(message, 'KMS');
        break;
      case 'sakuno-tms':
        add_role(message, 'TMS');
        break;
      default:
        message.channel.send('invalid command ;-;');
    }
  } 
});

// UTILITY FUNCTIONS
const verify_hayato = async (ign, server) => {
  try {
    const response = await axios.get(`https://api.maplestory.gg/v1/public/character/${server}/${ign}`);
    const relevant_info = {
      job: response?.data?.Class,
      server: response?.data?.Server,
      name: response?.data?.Name,
    };
    return relevant_info.job === 'Hayato' && relevant_info;
  } catch (err) {
    console.log(error);
    return false;
  }
}

const is_valid_command = (
  command,
  args,
  ) => {
  return typeof command === 'string' && Array.isArray(args);
};

// TODO: add map to translate from gg server id to role name
const add_role = (msg, role_name) => {
  const role = msg.guild.roles.cache.find(r => r.name.toLowerCase() === role_name);
  const member = msg?.guild?.members?.cache.get(msg?.author?.id);
  member.roles.add(role).then((res) => console.log(res?.data)).catch(console.error);
};

// TODO: everything... :)
const assign_name = (msg, ign) => {};

verify_hayato('beanary', 'gms');
