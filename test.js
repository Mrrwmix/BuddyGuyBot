const axios = require('axios');

axios.get('https://cat-fact.herokuapp.com/facts').then(response => {
  console.log(
    response.data.all[Math.floor(Math.random() * response.data.all.length)].text
  );
});
