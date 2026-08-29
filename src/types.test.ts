// Import specific types from discord.js for mocking
import { GuildMember, GuildTextBasedChannel, Message } from 'discord.js';
import { describe, expect, it } from 'vitest';

import { CommandContext } from './types';

// Create simple mock objects that satisfy the basic structure needed for our tests
const mockMessage: Partial<Message> = {
  // Using a simple function that returns a promise
  reply: async () => Promise.resolve({} as Message)
};

const mockMember: Partial<GuildMember> = {
  displayName: 'TestUser'
};

const mockChannel: Partial<GuildTextBasedChannel> = {
  name: 'general'
};

describe('Types', () => {
  describe('CommandContext', () => {
    it('should be compatible with an object containing message, args, member, and channel', () => {
      // Explicitly cast to the required types for the test
      const context: CommandContext = {
        message: mockMessage as Message,
        args: ['arg1', 'arg2'],
        member: mockMember as GuildMember,
        channel: mockChannel as GuildTextBasedChannel
      };

      expect(context).toHaveProperty('message');
      expect(context).toHaveProperty('args');
      expect(context).toHaveProperty('member');
      expect(context).toHaveProperty('channel');

      expect(Array.isArray(context.args)).toBe(true);
      expect(context.message).toBe(mockMessage);
      expect(context.member).toBe(mockMember);
      expect(context.channel).toBe(mockChannel);
    });

    it('should allow member to be optional', () => {
      const contextWithoutMember: CommandContext = {
        message: mockMessage as Message,
        args: [],
        member: undefined, // Explicitly undefined
        channel: mockChannel as GuildTextBasedChannel
      };

      expect(contextWithoutMember).toBeDefined();
      expect(contextWithoutMember.member).toBeUndefined();
    });
  });
});
