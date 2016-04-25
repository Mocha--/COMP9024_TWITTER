'use strict';

let nano = require('nano')('http://localhost:5984');
let db = nano.use('twittes');
exports.insert = db.insert
