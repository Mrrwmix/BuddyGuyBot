import { ActivityType, Client, GatewayIntentBits, Partials } from 'discord.js';

import { CommandContext } from './types';
import { channelIdMap } from "./lib"
import { config } from 'dotenv';

config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ],
  partials: [Partials.Channel]
});

const token = process.env.BOT_TOKEN;
const prefix = '!';
const { dev, announcements } = channelIdMap;

// Initialize commands
const commands = new Map<string, any>();
// Additional commands would go here
// commands.set('catfact', new CatFactCommand());
// commands.set('sticker', new StickerCommand());
// etc.

client.once('ready', () => {
  console.log('Bot is working');
  
  // Set bot activity
  if (client.user) {
    client.user.setActivity('for !commands', { type: ActivityType.Watching });
  }
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  
  // Handle hello responses
  if (message.content.toLowerCase() === 'hello') {
    const chance = Math.random();
    let response: string;
    
    if (chance > 0.9) response = 'Eff off!';
    else if (chance > 0.8) response = 'Wazzzzzzzzzzzzzzzzzup!?';
    else if (chance > 0.7) response = 'Don\'t be a Yamcha.';
    else if (chance > 0.6) response = 'I\'m not your friend, pal.';
    else if (chance > 0.5) response = 'BULLSHARK TESTOSTERONE!';
    else if (chance > 0.4) response = 'Big gulps, huh? Welp, see ya later.';
    else if (chance > 0.3) response = 'I know Kung-Fu.';
    else if (chance > 0.2) response = 'Fight the powa!';
    else if (chance > 0.1) response = 'With great power comes great responsibility.';
    else response = 'Wot?';
    
    await message.reply({ content: response });
    return;
  }

  // Handle commands
  if (!message.content.startsWith(prefix)) return;
  
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift()?.toLowerCase();
  
  if (!commandName) return;
  
  const command = commands.get(commandName);
  if (command) {
    try {
      const context: CommandContext = {
        message,
        args,
        member: message.member,
        channel: message.channel
      };
      await command.execute(context);
    } catch (error) {
      console.error(`Error executing command ${commandName}:`, error);
      await message.channel.send({ content: 'There was an error executing that command.' });
    }
  }
});

client.login(token).catch(error => {
  console.error('Failed to login:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled promise rejection:', reason);
});