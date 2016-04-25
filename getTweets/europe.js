var europeJson = require('../locations/europe');
var getTweetsService = require('./getTweetsService');
var couchdbInsert = require('./couch')

getTweetsService.getTweets(europeJson, 0, couchdbInsert);
