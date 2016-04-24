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

function getTweets(jsonData, clientNumber) {
    Twitter.clients[clientNumber].stream('statuses/filter', {
        track: getLocations(jsonData)
    }, function(stream) {
        stream.on('data', function(tweet) {
            if (tweet.user) {
                userName = tweet.user.name || "****";
                screenName = tweet.user.screen_name || "****";
                created = tweet.created_at || "****";
                location = tweet.user.location || "****";
                retweetCount = tweet.retweet_count;
                text = tweet.text || "****";
                console.log([userName, screenName, created, location, retweetCount, text]);
            }
        });
        stream.on('error', function(error) {
            throw error;
        });
    });
}

exports.getTweets = getTweets;