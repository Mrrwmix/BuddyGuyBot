import {
  ActivityType,
  ChannelType,
  Client,
  GatewayIntentBits,
  GuildTextBasedChannel,
  Partials
} from 'discord.js';

import { CommandContext } from './types';
import { FplDeadlineCommand } from './commands/fplDeadlineCommand'; // Import the new command
import { channelIdMap } from './lib';
import { config } from 'dotenv';
import { configure, getConsoleSink } from '@logtape/logtape';

config();

(async () => {
  await configure({
    loggers: [
      { category: 'default', lowestLevel: 'debug', sinks: ['console'] },
      { category: ['commands', 'fpldeadline'], lowestLevel: 'debug', sinks: ['console'] }, // Explicitly configure the FPL command logger
      { category: ['logtape', 'meta'], lowestLevel: 'debug', sinks: ['console'] }         // Configure the meta logger
    ],
    sinks: { console: getConsoleSink() }
  });
})();

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
commands.set('fpldeadline', new FplDeadlineCommand()); // Register the new command

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

client.on('messageCreate', async message => {
  if (message.author.bot) return;

  // Handle hello responses
  if (message.content.toLowerCase() === 'hello') {
    const chance = Math.random();
    let response: string;

    if (chance > 0.9) response = 'Eff off!';
    else if (chance > 0.8) response = 'Wazzzzzzzzzzzzzzzzzup!?';
    else if (chance > 0.7) response = "Don't be a Yamcha. :yamcha:";
    else if (chance > 0.6) response = "I'm not your friend, pal. :ppgoku:";
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

  // Guard: Only process commands in GuildTextBasedChannels
  // Check if it's a DM first. isDMBased() correctly identifies DMs even if partial.
  if (message.channel.isDMBased()) {
    await message.reply('This command cannot be used in Direct Messages.');
    return;
  }

  // At this point, message.channel is definitely NOT a DM.
  // It is a channel from a Guild (Text, News, Thread) or a partial version of one.
  // The type narrowing should now work correctly for Guild-based channels.
  // Check if its type is one of the guild text-based types.
  // Since it's not DMBased, its 'type' property should be a Guild-specific ChannelType.
  const guildTextChannelTypes = [
    ChannelType.GuildText,
    ChannelType.GuildAnnouncement, // News channel
    ChannelType.PublicThread,
    ChannelType.PrivateThread
  ];

  // Check if the fetched channel's type is in our allowed list.
  // This should now work without the 'never' type error because we've excluded DMs.
  if (!guildTextChannelTypes.includes(message.channel.type)) {
    await message.reply('This command cannot be used here.');
    return;
  }

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift()?.toLowerCase();

  if (!commandName) return;

  const command = commands.get(commandName);
  if (command) {
    try {
      // At this point, we are confident message.channel is a GuildTextBasedChannel.
      // message.member can be null, so we assign it as is (it's optional in CommandContext)
      const context: CommandContext = {
        message,
        args,
        member: message.member ?? undefined, // Convert null to undefined if needed by the type
        channel: message.channel // This is now guaranteed to be a GuildTextBasedChannel by the checks above
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
