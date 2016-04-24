var Twitter = require('twitter');
var CONSTANTS = require('./constants');

var client = new Twitter({
    consumer_key: CONSTANTS.getJson.consumer_key,
    consumer_secret: CONSTANTS.getJson.consumer_secret,
    access_token_key: CONSTANTS.getJson.access_token_key,
    access_token_secret: CONSTANTS.getJson.access_token_secret
});

exports.client = client;