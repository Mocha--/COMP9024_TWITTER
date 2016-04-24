var oceaniaJson = require('../locations/oceania');
var getTweetsService = require('./getTweetsService');

getTweetsService.getTweets(oceaniaJson, 1);