var northAmericaJson = require('../locations/northAmerica');
var getTweetsService = require('./getTweetsService');
var couchdbInsert = require('./couch')

getTweetsService.getTweets(northAmericaJson, 2, couchdbInsert);
