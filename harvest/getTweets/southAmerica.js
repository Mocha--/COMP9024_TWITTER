var southAmericaJson = require('../locations/southAmerica');
var getTweetsService = require('./getTweetsService');
var couchdbInsert = require('./couch')

getTweetsService.getTweets(southAmericaJson, 3, couchdbInsert);
