require("dotenv").config();
const axios = require("axios");
const Giphy = require("giphy-js-sdk-core");
let giphyToken = process.env.GIPHY_KEY;
let giphy = Giphy(giphyToken);
const cheerio = require("cheerio");
const numeral = require("numeral");

// giphy tests
// giphy.random('gifs', `sesame street`).then(res => {
//   console.log(`${res.data.url}`);
// });

// giphy.search('gifs', { q: 'yomega' }).then(res => {
//   // console.log(res.data[Math.floor(Math.random() * res.data.length)].url);
//   console.log(res.data.length > 0, 'length');
// });

// virus tracker test
axios
  .get("https://thevirustracker.com/free-api?countryTotal=US")
  .then((response) => {
    if (response.data.countrydata) {
      console.log(
        `${response.data.countrydata[0].info.title}\nTotal cases: ${numeral(
          response.data.countrydata[0].total_cases
        ).format("0,0")}\nTotal recovered: ${
          response.data.countrydata[0].total_recovered
        }\nTotal deaths: ${
          response.data.countrydata[0].total_deaths
        }\nTotal new cases today: ${
          response.data.countrydata[0].total_new_cases_today
        }\nTotal new deaths today: ${
          response.data.countrydata[0].total_new_deaths_today
        }`
      );
    } else {
      console.log("nope");
    }
  });

// attempt to webscrape epic's free games
// need to mimic this with cheerio
// [...document.querySelectorAll('span')].filter(el => el.textContent.includes('Free Now') && el.attributes.length == 1)

// axios.get('https://www.epicgames.com/store/en-US/free-games').then(response => {
//   const $ = cheerio.load(response.data);

//   try {
//     console.log($('a[href]'));
//   } catch (error) {
//     if (error) {
//       throw error;
//     }
//   }
// });
// require('dotenv').config();

// const Discord = require('discord.js');
// const reminderBot = new Discord.Client();
// const token = process.env.BOT_TOKEN;

// reminderBot.login(token).then(() => {
//   console.log('I am ready');
//   var guild = reminderBot.guilds.get('guildid');
//   if (guild && guild.channels.get('channelid')) {
//     guild.channels
//       .get('channelid')
//       .send('Testle')
//       .then(() => reminderBot.destroy());
//   } else {
//     console.log('nope');
//     //if the bot doesn't have guild with the id guildid
//     // or if the guild doesn't have the channel with id channelid
//   }
//   reminderBot.destroy();
// });
