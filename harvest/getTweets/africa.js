var africa1Json = require('../locations/africa1');
var africa2Json = require('../locations/africa2');
var getTweetsService = require('./getTweetsService');
var couchdbInsert = require('./couch')

getTweetsService.getTweets(africa1Json, 6, couchdbInsert);
getTweetsService.getTweets(africa2Json, 7, couchdbInsert);
