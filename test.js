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

axios.get('https://picsum.photos/500/300').then(response => {
  // console.log(Object.keys(response.request.res.client._httpMessage.res));
  console.log(response.request.res.client._httpMessage.res.responseUrl);
});
/*
[ '_events',
  '_eventsCount',
  '_maxListeners',
  'output',
  'outputEncodings',
  'outputCallbacks',
  'outputSize',
  'writable',
  '_last',
  'chunkedEncoding',
  'shouldKeepAlive',
  'useChunkedEncodingByDefault',
  'sendDate',
  '_removedConnection',
  '_removedContLen',
  '_removedTE',
  '_contentLength',
  '_hasBody',
  '_trailer',
  'finished',
  '_headerSent',
  'socket',
  'connection',
  '_header',
  '_onPendingData',
  'agent',
  'socketPath',
  'timeout',
  'method',
  'path',
  '_ended',
  'res',
  'aborted',
  'timeoutCb',
  'upgradeOrConnect',
  'parser',
  'maxHeadersCount',
  '_redirectable' ]
  */
