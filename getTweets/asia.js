var asia1Json = require('../locations/asia1');
var asia2Json = require('../locations/asia2');
var asia3Json = require('../locations/asia3');
var getTweetsService = require('./getTweetsService');

getTweetsService.getTweets(asia1Json, 8);
getTweetsService.getTweets(asia2Json, 9);
getTweetsService.getTweets(asia3Json, 10);