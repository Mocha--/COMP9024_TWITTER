/*
xibo wang 652158
yiming tan 676303
yuqing han 680292
xiang xue 675875
mengya wang 692448
 */

var nano = require('nano')('http://115.146.85.141:5984');
var writeDb = nano.use('travel_stats');
var readDb = nano.use('twittes');
var getTweetsService = require('./getTweets/getTweetsService');
var travelJson = require('./constant/locations/travel');

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
