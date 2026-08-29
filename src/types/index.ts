import { Channel, GuildMember, Message } from 'discord.js';

export interface CommandContext {
  message: Message;
  args: string[];
  member: GuildMember | null;
  channel: Channel;
}

export interface PokemonData {
  id: number;
  name: string;
  types: Array<{ type: { name: string } }>;
  stats: Array<{ stat: { name: string }; base_stat: number }>;
  sprites: { front_default: string };
}

export interface MovieData {
  Title: string;
  Year: string;
  Country: string;
  Plot: string;
  Actors: string;
  imdbRating: string;
}

export interface CovidData {
  total_cases: number;
  total_recovered: number;
  total_deaths: number;
  total_new_cases_today: number;
  total_new_deaths_today: number;
}

export interface ConcertData {
  venue: {
    name: string;
    city: string;
    region: string;
    country: string;
  };
  datetime: string;
}

export interface CatFactData {
  text: string;
}