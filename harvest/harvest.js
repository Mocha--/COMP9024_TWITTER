var nano = require('nano')('http://115.146.85.141:5984');
var writeDb = nano.use('travel_stats');
var readDb = nano.use('twittes');
var getTweetsService = require('./getTweets/getTweetsService');
var travelJson = require('./constant/locations/travel');

var australia1 = require('./constant/locations/australia1');
var australia2 = require('./constant/locations/australia2');
var europe = require('./constant/locations/europe');
var northAmerica = require('./constant/locations/northAmerica');
var oceania = require('./constant/locations/oceania');
var southAmerica = require('./constant/locations/southAmerica');
var africa1 = require('./constant/locations/africa1');
var africa2 = require('./constant/locations/africa2');
var asia1 = require('./constant/locations/asia1');
var asia2 = require('./constant/locations/asia2');
var asia3 = require('./constant/locations/asia3');

var totalNum = process.argv[2];
var instanceNum = process.argv[3];

if (instanceNum > totalNum) {
    console.log("totalNum should be greater than instanceNum!");
    process.exit(1);
} else {
    // seperate keywords for each instance
    var keywordsArray = getTweetsService.getLocations(travelJson).split(',');
    var keywordsLength = keywordsArray.length;
    var startIndex = (instanceNum - 1) * Math.floor(keywordsLength / totalNum);
    var endIndex = 0;
    if (instanceNum === totalNum) {
        endIndex = keywordsLength - 1;
    } else {
        endIndex = instanceNum * Math.floor(keywordsLength / totalNum) - 1;
    }
    // seperate keywords for each process
    var totalWords = endIndex - startIndex + 1;
    const length = 350;
    var accountNum = Math.ceil(totalWords / length);
    for (var i = 0; i < accountNum; i++) {
        var num = (instanceNum - 1) * accountNum + i;
        var start = startIndex + i * length;
        var end = start + length - 1;
        if (start + length - 1 > endIndex) {
            end = endIndex;
        }
        var keywordsString = keywordsArray.slice(start, end + 1).join();
        getTweetsService.getTweets(keywordsString, num, writeDb.insert);
    }
}
