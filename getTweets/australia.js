var australia1Json = require('../locations/australia1');
var australia2Json = require('../locations/australia2');
var getTweetsService = require('./getTweetsService');

getTweetsService.getTweets(australia1Json, 4);
getTweetsService.getTweets(australia2Json, 5);