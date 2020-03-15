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
  .get('https://thevirustracker.com/free-api?countryTotal=US')
  .then(response => {
    if (response.data.countrydata) {
      console.log(
        `Total cases: ${response.data.countrydata[0].total_cases}\nTotal recovered: ${response.data.countrydata[0].total_recovered}\nTotal deaths: ${response.data.countrydata[0].total_deaths}\nTotal new cases today: ${response.data.countrydata[0].total_new_cases_today}\nTotal new deaths today: ${response.data.countrydata[0].total_new_deaths_today}`
      );
    } else {
      console.log('nope');
    }
  });
