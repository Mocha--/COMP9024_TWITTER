var africa1Json = require('../locations/africa1');
var africa2Json = require('../locations/africa2');
var getTweetsService = require('./getTweetsService');

getTweetsService.getTweets(africa1Json, 6);
getTweetsService.getTweets(africa2Json, 7);