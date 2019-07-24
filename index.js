require('dotenv').config();
const Discord = require('discord.js');
const axios = require('axios');
const moment = require('moment');

const bot = new Discord.Client();

const token = process.env.DISCORD_TOKEN;
const darkskyKey = process.env.DARK_SKY_KEY;
const prefix = '!';

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

bot.on('message', msg => {
  if (!msg.content.startsWith(prefix)) {
    return;
  }
  const args = msg.content
    .slice(prefix.length)
    .trim()
    .split(/ +/g);
  const command = args.shift().toLowerCase();
  console.log(args);
  console.log(command);
  var parameters = args.join(' ');
  console.log(parameters);

  switch (command) {
    case 'concerts':
      axios
        .get(
          `https://rest.bandsintown.com/artists/${parameters
            .split(' ')
            .join('+')}/events?app_id=codingbootcamp`
        )
        .then(response => {
          for (var i = 0; i < response.data.length; i++) {
            msg.channel.send(
              response.data[i].venue.name +
                ' in ' +
                response.data[i].venue.city +
                ', ' +
                response.data[i].venue.region +
                ', ' +
                response.data[i].venue.country +
                ' on ' +
                moment(response.data[i].datetime).format('MM/DD/YYYY') +
                '.'
            );
          }
        })
        .catch(function(err) {
          console.log(err);
        });

      break;
    case 'movie':
      axios
        .get(
          `http://www.omdbapi.com/?t=${parameters}&y=&plot=short&apikey=trilogy`
        )
        .then(response => {
          if (response.data.Response == 'False') {
            return msg.channel.send(response.data.Error);
          }
          msg.channel.send(
            `${response.data.Title} was released in the year ${
              response.data.Year
            } and produced in ${response.data.Country}. Plot: ${
              response.data.Plot
            } Actors: ${response.data.Actors}. IMDB Rating: ${
              response.data.imdbRating
            }`
          );
        });
      break;
    case 'wtf':
      axios
        .get(`https://foaas.com/madison/${parameters}/buddyGuybot`)
        .then(response => {
          msg.channel.send(response.data.message);
        });
      break;
    case 'trump':
      axios
        .get('https://foaas.com/everything/buddyGuyBot')
        .then(function(response) {
          msg.reply(response.data.message);
        });
      break;
    default:
      break;
  }
});

function trump() {}
bot.login(token);
