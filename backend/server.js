var express = require('express');
var app = express();
var nano = require('nano')('http://115.146.85.141:5984');
var db = nano.use('travel_stats');

const OVERALL = 'overall';
const BASEONFROM = 'baseOnFrom';
const BASEONTO = 'baseOnTo';

function getData(design, view, cb) {
    db.view(design, view, { group: true }, function(err, body) {
        if (!err) {
        	cb(body.rows);
        } else {
            console.log(err);
        }
    });
}

// overall
app.get('/overall/overseasVsDomestic', function (req, res) {
	var cb = res.send.bind(res);
	getData(OVERALL, 'overseasVsDomestic', cb);
});

app.get('/overall/countryCount', function (req, res) {
	var cb = res.send.bind(res);
	getData(OVERALL, 'countryCount', cb);
});

// base on from
app.get('/baseOnFrom/melVsSyd', function (req, res) {
	var cb = res.send.bind(res);
	getData(BASEONFROM, 'melVsSyd', cb);
});

app.get('/baseOnFrom/overseasVsDomestic', function (req, res) {
	var cb = res.send.bind(res);
	getData(BASEONFROM, 'overseasVsDomestic', cb);
});

app.get('/baseOnFrom/states', function (req, res) {
	var cb = res.send.bind(res);
	getData(BASEONFROM, 'states', cb);
});

// base on to
app.get('/baseOnTo/cityInState', function (req, res) {
	var cb = res.send.bind(res);
	getData(BASEONTO, 'cityInState', cb);
});

app.get('/baseOnTo/countryInContinent', function (req, res) {
	var cb = res.send.bind(res);
	getData(BASEONTO, 'countryInContinent', cb);
});

app.get('/baseOnTo/domesticStateWithAttitude', function (req, res) {
	var cb = res.send.bind(res);
	getData(BASEONTO, 'domesticStateWithAttitude', cb);
});

app.get('/baseOnTo/overseasContinentWithAttitude', function (req, res) {
	var cb = res.send.bind(res);
	getData(BASEONTO, 'overseasContinentWithAttitude', cb);
});

app.listen(8080, function() {
    console.log('Example app listening on port 8080!');
});