var southAmericaJson = require('../locations/southAmerica');
var getTweetsService = require('./getTweetsService');

getTweetsService.getTweets(southAmericaJson, 3);