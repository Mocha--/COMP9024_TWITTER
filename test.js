'use strict';

let nano = require('nano')('http://115.146.85.141:5984/');
let testDB = nano.use('travel_stats');

testDB.view('overall', 'overseasVsDomestic', {
        group: true
    },

    function(err, res) {
        if (err) {
            console.log(err);
        } else {
            console.log(res);
        }
    })
