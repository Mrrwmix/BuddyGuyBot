import { CommandContext } from '../types';

export abstract class BaseCommand {
  abstract readonly name: string;
  abstract readonly description: string;
  
  abstract execute(context: CommandContext): Promise<void> | void;
}