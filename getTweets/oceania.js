var oceaniaJson = require('../locations/oceania');
var getTweetsService = require('./getTweetsService');
var couchdbInsert = require('./couch')

getTweetsService.getTweets(oceaniaJson, 1, couchdbInsert);
