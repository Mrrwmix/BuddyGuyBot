require('dotenv').config();
const Discord = require('discord.js');
const axios = require('axios');
const moment = require('moment');
const Pokedex = require('pokedex-promise-v2');
const Giphy = require('giphy-js-sdk-core');

const bot = new Discord.Client();

const token = process.env.DISCORD_TOKEN;
const darkskyKey = process.env.DARK_SKY_KEY;
var giphyToken = process.env.GIPHY_KEY;
const prefix = '!';

var P = new Pokedex();
var giphy = Giphy(giphyToken);
bot.on('ready', () => {
  console.log('Bot is working');
});
bot.login(token);

bot.on('message', msg => {
  if (msg.content.toLowerCase() == 'hello') {
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
    case 'joke':
      axios
        .get('https://icanhazdadjoke.com/slack')
        .then(response =>
          msg.channel.send(`${response.data.attachments[0].text}`)
        );
      break;
    case 'sticker':
      giphy.random('stickers', '').then(res => {
        msg.channel.send(`${res.data.url}`);
      });
      break;
    case 'random':
      giphy.random('gifs', '').then(res => {
        msg.channel.send(`${res.data.url}`);
      });
      break;
    case 'pokemon':
      P.getPokemonByName(parameters).then(function(response) {
        var stats = '';
        for (x in response.stats) {
          stats = stats.concat(
            `${response.stats[x].stat.name}(${response.stats[x].base_stat}) `
          );
        }
        var type;
        if (response.types.length > 1) {
          type = `${response.types[0].type.name} and ${
            response.types[1].type.name
          }`;
        } else {
          type = `${response.types[0].type.name}`;
        }
        msg.channel.send(
          `${response.name} is Pokemon #${
            response.id
          }\nType: ${type}\nStats: ${stats}\nSprite: ${
            response.sprites.front_default
          }`
        );
      });
      break;

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
    default:
      break;
  }
});
