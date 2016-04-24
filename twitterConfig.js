var Twitter = require('twitter');
var twitterKeys = require('./constant/twitterApps');

clients = [];

for (var i = 0; i < 11; i++) {
    var client = new Twitter({
        consumer_key: twitterKeys[i].consumer_key,
        consumer_secret: twitterKeys[i].consumer_secret,
        access_token_key: twitterKeys[i].access_token_key,
        access_token_secret: twitterKeys[i].access_token_secret
    });
    clients.push(client);
}

exports.clients = clients;