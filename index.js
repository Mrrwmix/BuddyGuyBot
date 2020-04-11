require("dotenv").config();
const Discord = require("discord.js");
const axios = require("axios");
const moment = require("moment");
const Pokedex = require("pokedex-promise-v2");
const Giphy = require("giphy-js-sdk-core");
const numeral = require("numeral");

const bot = new Discord.Client();

const token = process.env.BOT_TOKEN;
const darkskyKey = process.env.DARK_SKY_KEY;
let giphyToken = process.env.GIPHY_KEY;
const prefix = "!";

let P = new Pokedex();
let giphy = Giphy(giphyToken);
bot.on("ready", () => {
  console.log("Bot is working");

  setInterval(function () {
    bot.channels
      .get("183390087806058497")
      .send("https://www.epicgames.com/store/en-US/free-games");
  }, 604800000);
});
bot.login(token);

bot.on("message", (msg) => {
  if (msg.content.toLowerCase() == "hello") {
    let chance = Math.random();
    if (chance > 0.9) {
      msg.reply("Eff off!");
    } else if (chance > 0.8) {
      msg.reply("Wazzzzzzzzzzzzzzzzzup!?");
    } else if (chance > 0.7) {
      msg.reply("Don't be a Yamcha. :yamcha:");
    } else if (chance > 0.6) {
      msg.reply("I'm not your friend, pal. :ppgoku:");
    } else if (chance > 0.5) {
      msg.reply("BULLSHARK TESTOSTERONE!");
    } else if (chance > 0.4) {
      msg.reply("Big gulps, huh? Welp, see ya later.");
    } else if (chance > 0.3) {
      msg.reply("I know Kung-Fu.");
    } else if (chance > 0.2) {
      msg.reply("Fight the powa!");
    } else if (chance > 0.1) {
      msg.reply("With great power comes great responsibility.");
    } else {
      msg.reply("Wot?");
    }
  }
});

bot.on("message", (msg) => {
  if (!msg.content.startsWith(prefix)) {
    return;
  }
  const args = msg.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  console.log(args);
  console.log(command);
  let parameters = args.join(" ");
  console.log(parameters);

  switch (command) {
    case "joke":
      if (Math.random() > 0.5) {
        axios
          .get("https://icanhazdadjoke.com/slack")
          .then((response) =>
            msg.channel.send(`${response.data.attachments[0].text}`)
          );
      } else {
        axios
          .get("https://official-joke-api.appspot.com/random_joke")
          .then((response) => {
            msg.channel.send(
              `${response.data.setup}\n${response.data.punchline}`
            );
          });
      }
      break;
    case "catfact":
      axios.get("https://cat-fact.herokuapp.com/facts").then((response) => {
        msg.channel.send(
          `${
            response.data.all[
              Math.floor(Math.random() * response.data.all.length)
            ].text
          }`
        );
      });
      break;
    case "gif":
      if (parameters.length === 0) {
        msg.channel.send(
          `Don't forget to type in something to search for after "!gif". Example: !gif pokemon`
        );
      } else {
        giphy.search("gifs", { q: `${parameters}` }).then((res) => {
          if (res.data.length > 0) {
            msg.channel.send(
              res.data[Math.floor(Math.random() * res.data.length)].url
            );
          } else {
            msg.channel.send(
              `There were no results on Giphy for "${parameters}"`
            );
          }
        });
      }
      break;
    case "sticker":
      giphy.random("stickers", "").then((res) => {
        msg.channel.send(`${res.data.url}`);
      });
      break;
    case "random":
      giphy.random("gifs", "").then((res) => {
        msg.channel.send(`${res.data.url}`);
      });
      break;
    case "pokemon":
      P.getPokemonByName(parameters).then(function (response) {
        let stats = "";
        for (x in response.stats) {
          stats = stats.concat(
            `${response.stats[x].stat.name}(${response.stats[x].base_stat}) `
          );
        }
        let type;
        if (response.types.length > 1) {
          type = `${response.types[0].type.name} and ${response.types[1].type.name}`;
        } else {
          type = `${response.types[0].type.name}`;
        }
        msg.channel.send(
          `${response.name} is Pokemon #${response.id}\nType: ${type}\nStats: ${stats}\nSprite: ${response.sprites.front_default}`
        );
      });
      break;

    case "concerts":
      axios
        .get(
          `https://rest.bandsintown.com/artists/${parameters
            .split(" ")
            .join("+")}/events?app_id=codingbootcamp`
        )
        .then((response) => {
          for (let i = 0; i < response.data.length; i++) {
            msg.channel.send(
              response.data[i].venue.name +
                " in " +
                response.data[i].venue.city +
                ", " +
                response.data[i].venue.region +
                ", " +
                response.data[i].venue.country +
                " on " +
                moment(response.data[i].datetime).format("MM/DD/YYYY") +
                "."
            );
          }
        })
        .catch(function (err) {
          console.log(err);
        });

      break;
    case "movie":
      axios
        .get(
          `http://www.omdbapi.com/?t=${parameters}&y=&plot=short&apikey=trilogy`
        )
        .then((response) => {
          if (response.data.Response == "False") {
            return msg.channel.send(response.data.Error);
          }
          msg.channel.send(
            `${response.data.Title} was released in the year ${response.data.Year} and produced in ${response.data.Country}. Plot: ${response.data.Plot} Actors: ${response.data.Actors}. IMDB Rating: ${response.data.imdbRating}`
          );
        });
      break;
    case "insult":
      axios
        .get(
          "https://evilinsult.com/generate_insult.php?lang=en&type=plaintext"
        )
        .then((response) => {
          msg.channel.send(response.data);
        });
      break;
    case "advice":
      if (parameters.length === 0) {
        axios.get("https://api.adviceslip.com/advice").then((response) => {
          msg.channel.send(response.data.slip.advice);
        });
      } else {
        axios
          .get(`https://api.adviceslip.com/advice/search/${parameters}`)
          .then((response) => {
            if (response.data.message) {
              return msg.channel.send(
                response.data.message.text.replace(".", `: ${parameters}.`)
              );
            }
            msg.channel.send(
              response.data.slips[
                Math.floor(Math.random() * response.data.slips.length)
              ].advice
            );
          });
      }
      break;
    case "photo":
      axios.get("https://picsum.photos/500/300").then((response) => {
        return msg.channel.send(
          response.request.res.client._httpMessage.res.responseUrl
        );
      });
      break;
    default:
      break;
    case "covid":
      if (parameters.length === 0) {
        axios
          .get("https://thevirustracker.com/free-api?global=stats")
          .then((response) => {
            msg.channel.send(
              `Total cases: ${numeral(
                response.data.results[0].total_cases
              ).format("0,0")}\nTotal recovered: ${numeral(
                response.data.results[0].total_recovered
              ).format("0,0")}\nTotal deaths: ${numeral(
                response.data.results[0].total_deaths
              ).format("0,0")}\nNew cases today: ${numeral(
                response.data.results[0].total_new_cases_today
              ).format("0,0")}\nNew deaths today: ${numeral(
                response.data.results[0].total_new_deaths_today
              ).format("0,0")}`
            );
          });
      } else {
        axios
          .get(
            `https://thevirustracker.com/free-api?countryTotal=${parameters}`
          )
          .then((response) => {
            if (response.data.countrydata) {
              msg.channel.send(
                `${
                  response.data.countrydata[0].info.title
                }'s Covid-19 stats\nTotal cases: ${numeral(
                  response.data.countrydata[0].total_cases
                ).format("0,0")}\nTotal recovered: ${numeral(
                  response.data.countrydata[0].total_recovered
                ).format("0,0")}\nTotal deaths: ${numeral(
                  response.data.countrydata[0].total_deaths
                ).format("0,0")}\nTotal new cases today: ${numeral(
                  response.data.countrydata[0].total_new_cases_today
                ).format("0,0")}\nTotal new deaths today: ${numeral(
                  response.data.countrydata[0].total_new_deaths_today
                ).format("0,0")}`
              );
            } else {
              msg.channel.send(
                "Invalid country code. Use a 2-letter country code. Full list here:\nhttps://thevirustracker.com/api#indexpage"
              );
            }
          });
      }
      break;
  }
});
