var nano = require('nano')('http://115.146.85.141:5984');
var writeDb = nano.use('travel_stats');
var readDb = nano.use('twittes');
var getTweetsService = require('./getTweets/getTweetsService');
var jsonData = require('./constant/locations/australia1');

readDb.list(function (err, body) {
	console.log(body.total_rows)
})
// getTweetsService.getTweets(jsonData, 0, writeDb.insert);