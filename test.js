require('dotenv').config();
const axios = require('axios');
const Giphy = require('giphy-js-sdk-core');
let giphyToken = process.env.GIPHY_KEY;
let giphy = Giphy(giphyToken);

// giphy.random('gifs', `sesame street`).then(res => {
//   console.log(`${res.data.url}`);
// });

// giphy.search('gifs', { q: 'yomega' }).then(res => {
//   // console.log(res.data[Math.floor(Math.random() * res.data.length)].url);
//   console.log(res.data.length > 0, 'length');
// });

axios
  .get('https://evilinsult.com/generate_insult.php?lang=en&type=json')
  .then(response => {
    console.log(response.data.insult);
  });
