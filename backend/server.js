var express = require('express');
var app = express();
var nano = require('nano')('http://115.146.85.141:5984');
var db = nano.use('travel_stats');
var countryCode = require('./countryCode');

const OVERALL = 'overall';
const BASEONFROM = 'baseOnFrom';
const BASEONTO = 'baseOnTo';

/**
	API endpoints

	Overall
	1. heat map: localhost:8080/overall/countryCount (graph 3)
	2. overseas Vs domestic: localhost:8080/overall/overseasVsDomestic (graph 1)

	From
	3. melbourne Vs sydney: localhost:8080/baseOnFrom/melVsSyd (graph 6)
	4. overseas Vs domestic: localhost:8080/baseOnFrom/overseasVsDomestic (graph 4)
	5. states data: localhost:8080/baseOnFrom/states (graph 7)

	To
	6. city data of states: localhost:8080/baseOnTo/cityInState (graph 5)
	7. country data of continent: localhost:8080/baseOnTo/countryInContinent (graph 2)
	8. domestic state data with attitude: localhost:8080/baseOnTo/domesticStateWithAttitude (graph 5)
	9. overseas continent with attitude: localhost:8080/baseOnTo/overseasContinentWithAttitude (graph 2)
**/

function getData(design, view, cb) {
    db.view(design, view, { group: true }, function(err, body) {
        if (!err) {
        	cb(body.rows);
        } else {
            console.log(err);
        }
    });
}

function addCode(cb) {
	db.view(OVERALL, 'countryCount', { group: true }, function(err, body) {
        if (!err) {
        	var rawData = body.rows;
        	var newData = [];
        	rawData.forEach(function (data) {
        		var obj = {};
        		obj['name'] = data.key;
        		obj['value'] = data.value;
        		countryCode.code.forEach(function (code) {
        			if(code.name.toLowerCase() === data.key) {
        				obj['code'] = code.code;
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

// overall
app.get('/overall/overseasVsDomestic', function (req, res) {
	var cb = res.send.bind(res);
	getData(OVERALL, 'overseasVsDomestic', cb);
});

// heat map
app.get('/overall/countryCount', function (req, res) {
	var cb = res.send.bind(res);
	addCode(cb);
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