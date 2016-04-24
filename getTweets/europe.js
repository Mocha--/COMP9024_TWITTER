var europeJson = require('../locations/europe');
var getTweetsService = require('./getTweetsService');

getTweetsService.getTweets(europeJson, 0);