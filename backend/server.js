/*
xibo wang 652158
yiming tan 676303
yuqing han 680292
xiang xue 675875
mengya wang 692448

team 7
 */

var express = require('express');
var app = express();
var nano = require('nano')('http://115.146.85.141:5984');
var db = nano.use('travel_stats');
var countryCode = require('./countryCode');
var cors = require('cors');
var _ = require('lodash');
var aurin = require('./aurin');
var request = require('request');
app.use(cors());

const OVERALL = 'overall';
const BASEONFROM = 'baseOnFrom';
const BASEONTO = 'baseOnTo';

// graph 1
function convertDataForGraph1(cb) {
    db.view(OVERALL, 'overseasVsDomestic', {
        group: true
    }, function(err, body) {
        if (!err) {
            var rawData = body.rows;
            var newData = [];
            rawData.forEach(function(data) {
                var obj = {};
                obj['name'] = data.key;
                obj['y'] = data.value;
                newData.push(obj);
            });
            cb(newData);
        } else {
            console.log(err)
        }
    })
}

// graph 2
function convertDataForGraph2(cb) {
    db.view(BASEONTO, 'overseasContinentWithAttitude', {
        group: true
    }, function(err, data) {
        if (!err) {
            var rawData = data.rows;
            var newData = [];
            rawData.forEach(function(data) {
                var count = 0;
                newData.forEach(function(newdata) {
                    if (data.key[0] === newdata.name) {
                        if (data.key[1] === 'negative') {
                            newdata['negative'] = data.value;
                        } else {
                            newdata['positive'] = data.value;
                        }
                    } else {
                        count = count + 1;
                    }
                });
                if (count === newData.length) {
                    var obj = {};
                    obj['name'] = data.key[0];
                    if (data.key[1] === 'negative') {
                        obj['negative'] = data.value;
                    } else {
                        obj['positive'] = data.value;
                    }
                    newData.push(obj);
                }
            });
            db.view(BASEONTO, 'countryInContinent', {
                group: true
            }, function(err, data) {
                if (!err) {
                    var rawCountryData = data.rows;
                    var newCountryData = [];
                    var countryObj = {
                        'africa': {},
                        'asia': {},
                        'europe': {},
                        'north america': {},
                        'oceania': {},
                        'south america': {}
                    };
                    rawCountryData.forEach(function(data) {
                        var continent = data.key[0];
                        var country = data.key[1];
                        var value = data.value;
                        countryObj[continent][country] = value;
                    });
                    newData.forEach(function(data) {
                        data['countries'] = getFirstFiveItems(countryObj[data.name], data.positive + data.negative);
                    });
                    cb(newData);
                } else {
                    console.log(err);
                }
            });
        } else {
            console.log(err);
        }
    });
}

// graph 3, heat map
function convertDataForGraph3(cb) {
    db.view(OVERALL, 'countryCount', {
        group: true
    }, function(err, body) {
        if (!err) {
            var rawData = body.rows;
            var newData = [];
            rawData.forEach(function(data) {
                var obj = {};
                obj['name'] = capitalizeFirstLetter(data.key);
                obj['value'] = data.value;
                countryCode.code.forEach(function(code) {
                    if (code.name.toLowerCase() === data.key) {
                        obj['code'] = code.code;
                        newData.push(obj);
                    }
                });
            });
            cb(newData);
        } else {
            console.log(err);
        }
    });
}

// graph 4
function convertDataForGraph4(cb) {
    db.view(BASEONFROM, 'overseasVsDomestic', {
        group: true
    }, function(err, body) {
        if (!err) {
            var rawData = body.rows;
            var tempData = [];
            var newData = [];
            rawData.forEach(function(data) {
                var obj = {};
                obj['name'] = data.key[0];
                // overseas
                if (data.key[1]) {
                    obj['overseas'] = data.value;
                } else {
                    obj['domestic'] = data.value;
                }
                tempData.push(obj);
            });
            tempData.forEach(function(data) {
                var count = 0
                newData.forEach(function(newdata) {
                    if (newdata.name === data.name) {
                        if (_.has(newdata, 'domestic')) {
                            newdata['overseas'] = data.overseas;
                        } else {
                            newdata['domestic'] = data.domestic;
                        }
                    } else {
                        count = count + 1;
                    }
                });
                if (count === newData.length) {
                    newData.push(data);
                }
            });
            cb(getFirstFiveCities(newData));
        } else {
            console.log(err);
        }
    });
}

// graph 5
function convertDataForGraph5(cb) {
    db.view(BASEONTO, 'domesticStateWithAttitude', {
        group: true
    }, function(err, data) {
        if (!err) {
            var rawData = data.rows;
            var newData = [];
            rawData.forEach(function(data) {
                var count = 0;
                newData.forEach(function(newdata) {
                    if (data.key[0] === newdata.name) {
                        if (data.key[1] === 'negative') {
                            newdata['negative'] = data.value;
                        } else {
                            newdata['positive'] = data.value;
                        }
                    } else {
                        count = count + 1;
                    }
                });
                if (count === newData.length) {
                    var obj = {};
                    obj['name'] = data.key[0];
                    if (data.key[1] === 'negative') {
                        obj['negative'] = data.value;
                    } else {
                        obj['positive'] = data.value;
                    }
                    newData.push(obj);
                }
            });
            db.view(BASEONTO, 'cityInState', {
                group: true
            }, function(err, data) {
                if (!err) {
                    var rawCountryData = data.rows;
                    var newCountryData = [];
                    var countryObj = {
                        'new south wales': {},
                        'capital territory': {},
                        'western australia': {},
                        'queensland': {},
                        'north territory': {},
                        'victoria': {},
                        'tasmania': {}
                    };
                    rawCountryData.forEach(function(data) {
                        var state = data.key[0];
                        var city = data.key[1];
                        var value = data.value;
                        countryObj[state][city] = value;
                    });
                    newData.forEach(function(data) {
                        data['cities'] = getFirstFiveItems(countryObj[data.name], data.positive + data.negative);
                    });
                    cb(newData);
                } else {
                    console.log(err);
                }
            });
        } else {
            console.log(err);
        }
    });
}

// graph 6
function convertDataForGraph6(cb) {
    db.view(BASEONFROM, 'melVsSyd', {
        group: true
    }, function(err, data) {
        if (!err) {
            var rawData = data.rows;
            var newData = [];
            rawData.forEach(function(data) {
                var state = data.key[1];
                var city = data.key[0];
                var count = 0;
                newData.forEach(function(newdata) {
                    if (newdata.state === state) {
                        newdata[city] = data.value;
                    } else {
                        count = count + 1;
                    }
                });
                if (count === newData.length) {
                    var obj = {};
                    obj['state'] = state;
                    obj[city] = data.value;
                    newData.push(obj);
                }
            });
            cb(newData);
        } else {
            console.log(err);
        }
    });
}

// graph 7
function convertDataForGraph7(cb) {
    db.view(BASEONFROM, 'states', {
        group: true
    }, function(err, data) {
        if (!err) {
            var rawData = data.rows;
            var newData = [];
            rawData.forEach(function(data) {
                var obj = {};
                obj['state'] = data.key;
                obj['number'] = data.value;
                aurin.income.forEach(function(income) {
                    if (income.state === data.key) {
                        obj['income'] = income.wage;
                    }
                });
                aurin.population.forEach(function(population) {
                    if (population.state === data.key) {
                        obj['percentage'] = (data.value * 1000 / population.population).toFixed(3);
                    }
                });
                newData.push(obj);
            });
            cb(newData);
        } else {
            console.log(err);
        }
    });
}

function getTotalCount(cb) {
    request.get(
        'http://115.146.85.141:5984/travel_stats',
        function(err, res, body) {
            cb({ amount: JSON.parse(body).doc_count});
        });
}

function getFirstFiveItems(dict, total) {
    var items = Object.keys(dict).map(function(key) {
        return [key, dict[key]];
    });
    items.sort(function(first, second) {
        return second[1] - first[1];
    });
    var rawData = items.slice(0, 5);
    var newData = [];
    rawData.forEach(function(data) {
        var obj = {};
        obj['name'] = data[0];
        obj['percentage'] = (data[1] / total).toFixed(2);
        newData.push(obj);
    });
    return newData;
}

function getFirstFiveCities(array) {
    var dict = {};
    var newData = [];
    array.forEach(function(data) {
        var domestic = 0;
        var overseas = 0;
        if(data.domestic) {
            domestic = data.domestic;
        }
        if(data.overseas) {
            overseas = data.overseas;
        }
        dict[data.name] = domestic + overseas;
    });
    var items = Object.keys(dict).map(function(key) {
        return [key, dict[key]];
    });
    items.sort(function(first, second) {
        return second[1] - first[1];
    });
    var rawData = items.slice(0, 6);
    rawData.forEach(function(item) {
        array.forEach(function(data) {
            if (item[0] === data.name) {
                newData.push(data);
            }
        });
    });
    return newData;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
// total amount
app.get('/api/v1/amount', function(req, res) {
    var cb = res.send.bind(res);
    getTotalCount(cb);
});
// graph 1
app.get('/api/v1/graph1', function(req, res) {
    var cb = res.send.bind(res);
    convertDataForGraph1(cb);
});

// graph 2
app.get('/api/v1/graph2', function(req, res) {
    var cb = res.send.bind(res);
    convertDataForGraph2(cb);
});

// graph 3
app.get('/api/v1/graph3', function(req, res) {
    var cb = res.send.bind(res);
    convertDataForGraph3(cb);
});

// graph 4
app.get('/api/v1/graph4', function(req, res) {
    var cb = res.send.bind(res);
    convertDataForGraph4(cb);
});

// graph 5
app.get('/api/v1/graph5', function(req, res) {
    var cb = res.send.bind(res);
    convertDataForGraph5(cb);
});

// graph 6
app.get('/api/v1/graph6', function(req, res) {
    var cb = res.send.bind(res);
    convertDataForGraph6(cb);
});

// graph 7
app.get('/api/v1/graph7', function(req, res) {
    var cb = res.send.bind(res);
    convertDataForGraph7(cb);
});

/* db.get('averageIncomeByState', function(err, res) {
    if (!err) {
        console.log(res);
    }
});

db.get('populationByState', function(err, res) {
    if (!err) {
        console.log(res);
    }
});

*/

app.listen(8080, function() {
    console.log('Example app listening on port 8080!');
});
