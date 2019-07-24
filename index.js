require('dotenv').config();
const Discord = require('discord.js');

const bot = new Discord.Client();

const token = process.env.DISCORD_TOKEN;

bot.on('ready', () => {
  console.log('Bot is working');
});

bot.on('message', msg => {
  if (msg.content == 'hello') {
    let chance = Math.random();
    if (chance > 0.9) {
      msg.reply('Eff off!');
    } else if (chance > 0.8) {
      msg.reply('Wazzzzzzzzzzzzzzzzzup!?');
    } else if (chance > 0.7) {
      msg.reply("Don't be a Yamcha. :yamcha:");
    } else if (chance > 0.6) {
      msg.reply("I'm not your friend, pal. :ppgoku:");
    } else if (chance > 0.5) {
      msg.reply('BULLSHARK TESTOSTERONE!');
    } else if (chance > 0.4) {
      msg.reply('Big gulps, huh? Welp, see ya later.');
    } else if (chance > 0.3) {
      msg.reply('I know Kung-Fu.');
    } else if (chance > 0.2) {
      msg.reply('Fight the powa!');
    } else if (chance > 0.1) {
      msg.reply('With great power comes great responsibility.');
    } else {
      msg.reply('Wot?');
    }
  }
});

bot.login(token);
