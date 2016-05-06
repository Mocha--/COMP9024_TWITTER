'use strict';

const couchdbUrl = 'http://115.146.85.141:5984/';
let nano = require('nano')(couchdbUrl);
let db = nano.use('travel_stats');

let sample = {
    "_id": "16eb5731be02d6d424998428b02ec27c",
    "_rev": "1-d21e3b1d6066ed53ba1a78570c36e3fc",
    "attitude": "positive",
    "to": {
        "continent": "oceania",
        "state": null,
        "country": "australia",
        "city": null
    },
    "from": {
        "country": "australia",
        "state": "new south wales",
        "city": "sydney"
    },
    "overseas": false
};

db.insert({
    language: 'javascript',
    views: {

        map: function(doc) {

        },
        reduce: function(keys, values) {

        }
    }
}, '_design/basedOnTo', function(err, res) {
    if (!err) {
        console.log(res);
    }
})
