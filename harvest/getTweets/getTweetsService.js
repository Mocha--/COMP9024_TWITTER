/*
xibo wang 652158
yiming tan 676303
yuqing han 680292
xiang xue 675875
mengya wang 692448
 */

var _ = require('lodash');

var Twitter = require('../twitterConfig');
var analyzeService = require('../analyzeService');
var travelWords = require('../constant/travelWords');
var travelJson = require('../constant/locations/travel');

function getLocations(jsonData) {
    var keywords = [];
    var continents = _.keys(jsonData);
    var cities = [];
    // First level
    for (var i = 0; i < continents.length; i++) {
        // Second level
        if (continents[i] === 'australia') {
            var states = _.keys(jsonData[continents[i]]);
            keywords = keywords.concat(states);
            for(var j = 0; j < states.length; j++) {
                var cities = _.keys(jsonData[continents[i]][states[j]]);
                keywords = keywords.concat(cities);
                for(var k = 0; k < cities.length; k++) {
                    keywords = keywords.concat(jsonData[continents[i]][states[j]][cities[k]]);
                }
            }
        } else {
            var countries = _.keys(jsonData[continents[i]]);
            keywords = keywords.concat(countries);
            var locations = []
            for (var j = 0; j < countries.length; j++) {
                if (jsonData[continents[i]][countries[j]].length != 0) {
                    locations = locations.concat(jsonData[continents[i]][countries[j]]);
                }
            }
            keywords = keywords.concat(locations);
        }
    }
    keywords = keywords.concat(continents);
    return keywords.join();
}

function getTweets(keywordsString, clientNumber, cb) {
    var locations = keywordsString.toLowerCase();
    var locationsArray = locations.split(",");
    Twitter.clients[clientNumber].stream('statuses/filter', {
        track: keywordsString
    }, function(stream) {
        stream.on('data', function(tweet) {
            if (tweet.user) {
                var keywords = getKeywords(locationsArray, tweet.text);
                if (keywords.length != 0) {
                    var userName = tweet.user.name || "****";
                    var screenName = tweet.user.screen_name || "****";
                    var created = tweet.created_at || "****";
                    var location = tweet.user.location || "****";
                    var retweetCount = tweet.retweet_count;
                    var text = tweet.text || "****";
                    var obj = {
                        userName: userName,
                        screenName: screenName,
                        created: created,
                        location: location,
                        retweetCount: retweetCount,
                        text: text,
                        keywords: keywords
                    };
                    var newTweetArray = analyzeService.analyze(obj, travelWords.list, travelJson, cb);
                }
            }
        });
        stream.on('error', function(error) {
            throw error;
        });
    });
}

function getKeywords(locationsArray, text) {
    var wordsArray = text.split(" ");
    var keywords = [];
    for (var i = 0; i < wordsArray.length; i++) {
        if (locationsArray.indexOf(wordsArray[i].toLowerCase()) >= 0) {
            if (keywords.indexOf(wordsArray[i].toLowerCase()) == -1) {
                keywords.push(wordsArray[i].toLowerCase());
            }
        }
    }
    return keywords;
}

exports.getTweets = getTweets;
exports.getLocations = getLocations;
