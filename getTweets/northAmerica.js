var northAmericaJson = require('../locations/northAmerica');
var getTweetsService = require('./getTweetsService');

getTweetsService.getTweets(northAmericaJson, 2);