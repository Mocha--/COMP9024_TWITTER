/*
xibo wang 652158
yiming tan 676303
yuqing han 680292
xiang xue 675875
mengya wang 692448
 */

'use strict';

const couchdbUrl = 'http://115.146.85.141:5984/';
let nano = require('nano')(couchdbUrl);
let db = nano.use('travel_stats');

// baseOnTo
db.insert({
    'language': 'javascript',
    views: {
        overseasContinentWithAttitude: {
            map: function(doc) {
                if (doc.overseas && doc.to.continent && doc.attitude) {
                    emit([doc.to.continent, doc.attitude], 1);
                }
            },
            reduce: function(keys, values) {
                return sum(values);
            }
        },
        countryInContinent: {
            map: function(doc) {
                if (doc.overseas && doc.to.continent && doc.to.country) {
                    emit([doc.to.continent, doc.to.country], 1);
                }
            },
            reduce: function(keys, values) {
                return sum(values);
            }
        },
        domesticStateWithAttitude: {
            map: function(doc) {
                if (!doc.overseas && doc.to.state && doc.attitude) {
                    emit([doc.to.state, doc.attitude], 1);
                }
            },
            reduce: function(keys, values) {
                return sum(values);
            }
        },
        cityInState: {
            map: function(doc) {
                if (!doc.overseas && doc.to.state && doc.to.city) {
                    emit([doc.to.state, doc.to.city], 1);
                }
            },
            reduce: function(keys, values) {
                return sum(values);
            }
        }
    }
}, '_design/baseOnTo', function(err, res) {
    if (!err) {
        console.log(res);
    }
})

// overall
db.insert({
    language: 'javascript',
    views: {
        overseasVsDomestic: {
            map: function(doc) {
                if (doc.overseas) {
                    emit('overseas', 1);
                } else {
                    emit('domestic', 1);
                }
            },
            reduce: function(keys, values) {
                return sum(values);
            }
        },
        countryCount: {
            map: function(doc) {
                if (doc.to.country) {
                    emit(doc.to.country, 1);
                }
            },
            reduce: function(keys, values) {
                return sum(values);
            }
        }
    }
}, '_design/overall', function(err, res) {
    if (!err) {
        console.log(res);
    }
})

// basedOnFrom
db.insert({
    language: 'javascript',
    views: {
        overseasVsDomestic: {
            map: function(doc) {
                if (doc.from.city) {
                    emit([doc.from.city, doc.overseas], 1);
                }
            },
            reduce: function(keys, values) {
                return sum(values);
            }
        },
        melVsSyd: {
            map: function(doc) {
                if (!doc.overseas && doc.to.state && (doc.from.city === 'melbourne' || doc.from.city === 'sydney')) {
                    emit([doc.from.city, doc.to.state], 1);
                }
            },
            reduce: function(keys, values) {
                return sum(values);
            }
        },
        states: {
            map: function(doc) {
                if (doc.from.state) {
                    emit(doc.from.state, 1);
                }
            },
            reduce: function(keys, values) {
                return sum(values);
            }
        }
    }
}, '_design/baseOnFrom', function(err, res) {
    if (!err) {
        console.log(res);
    }
});
