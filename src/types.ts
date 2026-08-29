import { Message, GuildMember, GuildTextBasedChannel } from 'discord.js';

/**
 * Context object passed to command execution functions.
 */
export interface CommandContext {
  message: Message;
  args: string[];
  member?: GuildMember;
  channel: GuildTextBasedChannel;
}