const axios = require('axios').default;
require('dotenv').config();

// DISCORD LOGIC
const { Client } = require('discord.js');
const client = new Client();
const PREFIX = '/';

client.login(process.env.DISCORDJS_BOT_TOKEN);

client.on('ready', () => {});

client.on('message', async (message) => {
  if (message?.author?.bot) return;
  if (message?.content?.startsWith(PREFIX)) {
    const [command, ...args] = message.content
      .toLowerCase()
      .trim()
      .substring(PREFIX.length)
      .split(/\s+/);
    
    if (is_valid_command(command, args, 1) && command === 'sakuno-gms') {
      const ign = args[0];
      const server_name = 'gms';

      if (await verify_hayato(ign, server_name)) {
        const role = message.guild.roles.cache.find(r => r.name.toLowerCase() === server_name);
        const member = message?.guild?.members?.cache.get(message?.author?.id);
        member.roles.add(role).then((res) => console.log(res?.data)).catch(console.error);
      }
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
    if (relevant_info.job === 'Hayato') {
      // assign roles and name
      return true;
    } else {
      // post message in channel saying there was an error
      console.log(`oh no ${error}`);
      return false;
    }
  } catch (err) {
    // post message in channel saying there was an error
    console.log(`oh no ${error}`);
    return false;
  }
}

const is_valid_command = (
  command,
  args,
  expected_num_args
  ) => {
  return typeof command === 'string' && Array.isArray(args) && args.length === expected_num_args;
}

verify_hayato('beanary', 'gms');
