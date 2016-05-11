/*
xibo wang 652158
yiming tan 676303
yuqing han 680292
xiang xue 675875
mengya wang 692448
 */

'use strict';

let nano = require('nano')('http://115.146.94.165:5984');
let db = nano.use('travel_stats');

db.insert({
    "Tasmania": {
        "wage": "$65759",
        "rank": "8"
    },
    "South Australia": {
        "wage": "$69800",
        "rank": "7"
    },
    "Victoria": {
        "wage": "$72623",
        "rank": "6"
    },
    "Northern Territory": {
        "wage": "$75603",
        "rank": "5"
    },
    "Queensland": {
        "wage": "$75759",
        "rank": "4"
    },
    "New South Wales": {
        "wage": "$77600",
        "rank": "3"
    },
    "Western Australia": {
        "wage": "$87001",
        "rank": "2"
    },
    "Capital Territory": {
        "wage": "$88270",
        "rank": "1"
    }
}, 'averageIncomeByState', function(err, res) {
    if (!err) {
        console.log(res);
    }
});

db.insert({
    "New South Wales": {
        "population": "7644200",
        "rank": "1"
    },
    "Victoria": {
        "population": "5966700",
        "rank": "2"
    },
    "Queensland": {
        "population": "4792900",
        "rank": "3"
    },
    "South Australia": {
        "population": "1701100",
        "rank": "4"
    },
    "Western Australia": {
        "population": "2598200",
        "rank": "5"
    },
    "Tasmania": {
        "population": "517200",
        "rank": "6"
    },
    "Northern Territory": {
        "population": "244500",
        "rank": "7"
    },
    "Australian Capital Territory": {
        "population": "392000",
        "rank": "8"
    }
}, 'populationByState', function(err, res) {
    if (!err) {
        console.log(res);
    }
})
