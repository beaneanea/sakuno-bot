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
        if (char_info) {
          add_role(message, char_info?.server);
          assign_name(message, args[0]);
        } else {
          message.channel.send('You must enter the ign of your hayato to enter. Make sure that it is spelt correctly!');
        }
        break;
      case 'sakuno-ems':
        char_info = await verify_hayato(args[0], 'ems');
        if (char_info) {
          add_role(message, char_info?.server);
          assign_name(message, args[0]);
        } else {
          message.channel.send('You must enter the ign of your hayato to enter. Make sure that it is spelt correctly!');
        }
        break;
      case 'sakuno-ps':
        add_role(message, 'ps');
        assign_name(message, args[0]);
        break;
      case 'sakuno-cms':
        add_role(message, 'cms');
        assign_name(message, args[0]);
        break;
      case 'sakuno-kms':
        add_role(message, 'kms');
        assign_name(message, args[0]);
        break;
      case 'sakuno-msea':
        add_role(message, 'msea');
        assign_name(message, args[0]);
        break;
      case 'help':
        message.channel.send(`\`\`\`
        available commands:
        - sakuno-gms: 1 argument, [ign] This command gives the user a server role and assigns the user's nickname to the provided ign. /sakuno-gms hamtoryu\n
        - sakuno-ems: 1 argument, [ign] This command gives the user a server role and assigns the user's nickname to the provided ign. /sakuno-ems hamtoryuwu\n
        - sakuno-ps: 1 argument, [ign] This command gives the user a server role and assigns the user's nickname to the provided ign. /sakuno-ps hamtoryowo\n
        - sakuno-cms: 1 argument, [ign] This command gives the user a server role and assigns the user's nickname to the provided ign. /sakuno-cms hamtoworyu\n
        - sakuno-kms: 1 argument, [ign] This command gives the user a server role and assigns the user's nickname to the provided ign. /sakuno-kms hamtoworyuwu\n
        - sakuno-msea: 1 argument, [ign] This command gives the user a server role and assigns the user's nickname to the provided ign. /sakuno-msea hamtoworyowo\n
        - help: this? O_O
        \`\`\``);
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
    console.log(err);
    return false;
  }
}

const is_valid_command = (
  command,
  args,
  ) => {
  return typeof command === 'string' && Array.isArray(args);
};

const roles_map = {
  'Reboot (NA)': 'Reboot',
  'Reboot (EU)': 'Reboot EU',
  'Scania': 'Scania',
  'Bera': 'Bera',
  'Aurora': 'Aurora',
  'Elysium': 'Elysium',
  'Luna': 'Luna',
  'ps': 'Private Server',
  'msea': 'MapleSEA',
  'cms': 'CMS',
  'kms': 'KMS',
};

// TODO: add map to translate from gg server id to role name
const add_role = (msg, key) => {
  const role = msg.guild.roles.cache.find(r => r.name === roles_map[key]);
  const member = msg?.guild?.members?.cache.get(msg?.author?.id);

  if (msg.member.roles.cache.some(r=>Object.keys(roles_map).map(key => roles_map[key]).includes(r.name))) {
    msg.channel.send('You have already been assigned a role!');
    return;
  };

  member.roles.add(role).then((res) => console.log(res?.data)).catch((error) => {
    channel.send('An error occurred while adding your role! Please try again :3');
    console.log(error);
  });
};

const assign_name = (msg, ign) => {
  const member = msg?.guild?.members?.cache.get(msg?.author?.id);

  if (msg.member.roles.cache.some(r=>Object.keys(roles_map).map(key => roles_map[key]).includes(r.name))) return;

  member.setNickname(ign).catch((error) => {
    msg.channel.send('An error occurred while setting your nickname! Please try again :3');
    console.log(error);
  });
};
