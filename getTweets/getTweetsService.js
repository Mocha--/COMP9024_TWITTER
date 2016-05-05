var _ = require('lodash');

var Twitter = require('../twitterConfig');

function getLocations(jsonData) {
    var keywords = [];
    var continents = _.keys(jsonData);
    var cities = [];
    // First level
    for (var i = 0; i < continents.length; i++) {
        // Second level
        var countries = _.keys(jsonData[_.keys(jsonData)[i]]);
        keywords = keywords.concat(countries);
        var locations = []
        for (var j = 0; j < countries.length; j++) {
            if (jsonData[continents[i]][countries[j]].length != 0) {
                locations = locations.concat(jsonData[continents[i]][countries[j]]);
            }
        }
        keywords = keywords.concat(locations);
    }
    keywords = keywords.concat(continents);
    // keywords.push('Australia');
    return keywords.join();
}

function getTweets(jsonData, clientNumber, cb) {
    var locations = getLocations(jsonData);
    Twitter.clients[clientNumber].stream('statuses/filter', {
        track: locations
    }, function(stream) {
        stream.on('data', function(tweet) {
            if (tweet.user) {
                var keywords = getKeywords(jsonData, tweet.text);
                if (keywords.length != 0) {
                    var userName = tweet.user.name || "****";
                    var screenName = tweet.user.screen_name || "****";
                    var created = tweet.created_at || "****";
                    var location = tweet.user.location || "****";
                    var retweetCount = tweet.retweet_count;
                    var text = tweet.text || "****";

                    cb({
                        userName: userName,
                        screenName: screenName,
                        created: created,
                        location: location,
                        retweetCount: retweetCount,
                        text: text,
                        keywords: keywords
                    });
                }
            }
        });
        stream.on('error', function(error) {
            throw error;
        });
    });
}

function getKeywords(jsonData, text) {
    var locations = getLocations(jsonData).toLowerCase();
    var locationsArray = locations.split(",");
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
