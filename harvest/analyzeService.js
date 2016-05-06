var sentiment = require('sentiment');
var cld = require('cld');
var _ = require('lodash');

const AUSTRALIA = 'australia';
const OCEANIA = 'oceania';

// generate Australia locations
function generateAustraliaLocations(jsonData) {
    var locations = {
        country: [AUSTRALIA],
        states: [],
        cities: []
    };
    var australiaJson = jsonData[AUSTRALIA];
    var states = _.keys(australiaJson);
    // store states
    locations.states = convertToLowerCase(states);
    var cities = []
    for (var i = 0; i < states.length; i++) {
        var stateCities = _.keys(australiaJson[states[i]]);
        // store cities
        cities = cities.concat(stateCities);
    }
    locations.cities = convertToLowerCase(cities);
    return locations;
}

// convert string array to lower case
function convertToLowerCase(array) {
    return array.join('|').toLowerCase().split('|');
}

// find location stats
function findKeyword(jsonData, keyword) {
    var continents = _.keys(jsonData);
    var continentsLowerCase = convertToLowerCase(continents);
    var result = {
        continent: null,
        country: null,
        city: null,
        state: null
    };
    // continent level
    if (_.indexOf(continentsLowerCase, keyword) != -1) {
        // keyword is a continent
        if (keyword == AUSTRALIA) {
            result.continent = OCEANIA;
            result.country = keyword;
            result.overseas = false;
        } else {
            result.continent = keyword;
            result.overseas = true;
        }
        return result;
    } else {
        // country or state level
        for (var i = 0; i < continents.length; i++) {
            if (continents[i] !== AUSTRALIA) {
                var countries = _.keys(jsonData[continents[i]]);
                var countriesLowerCase = convertToLowerCase(countries);
                if (_.indexOf(countriesLowerCase, keyword) != -1) {
                    // keyword is a country
                    result.continent = continentsLowerCase[i];
                    result.country = keyword;
                    result.overseas = true;
                    return result;
                } else {
                    // city level
                    for (var j = 0; j < countries.length; j++) {
                        if (_.indexOf(convertToLowerCase(jsonData[continents[i]][countries[j]]), keyword) != -1) {
                            // keyword is a city
                            result.continent = continentsLowerCase[i];
                            result.country = countriesLowerCase[j];
                            result.city = keyword;
                            result.overseas = true;
                            return result;
                        } else {
                            return result;
                        }
                    }
                    return result;
                }
            } else {
                var states = _.keys(jsonData[continents[i]]);
                var statesLowerCase = convertToLowerCase(states);
                if (_.indexOf(statesLowerCase, keyword) != -1) {
                    // keyword is a state
                    result.continent = OCEANIA;
                    result.country = AUSTRALIA;
                    result.state = keyword;
                    result.overseas = false;
                    return result;
                } else {
                    // city level
                    for (var j = 0; j < states.length; j++) {
                        var cities = _.keys(jsonData[continents[i]][states[j]]);
                        var citiesLowerCase = convertToLowerCase(cities);
                        if (_.indexOf(citiesLowerCase, keyword) != -1) {
                            // keyword is a city
                            result.continent = OCEANIA;
                            result.country = AUSTRALIA;
                            result.state = statesLowerCase[j];
                            result.city = keyword;
                            result.overseas = false;
                            return result;
                        } else {
                            for (var k = 0; k < cities.length; k++) {
                                if (_.indexOf(convertToLowerCase(jsonData[continents[i]][states[j]][cities[k]]), keyword) != -1) {
                                    // keyword is an attraction
                                    result.continent = OCEANIA;
                                    result.country = AUSTRALIA;
                                    result.state = statesLowerCase[j];
                                    result.city = citiesLowerCase[k];
                                    result.overseas = false;
                                    return result;
                                } else {
                                    return result;
                                }
                            }
                        }
                    }
                    return result;
                }
            }
        }
    }
}

// only analyze tweet in English
function analyze(tweet, travelWords, jsonData, cb) {
    var newTweetArray = [];
    cld.detect(tweet.text, function(err, result) {
        if (!err && result.languages && result.languages.length > 0 && result.languages[0] !== undefined) {
            // get language
            var language = result.languages[0].name;
            // analyze tweet from Australian
            var from = locationDetect(tweet, jsonData);
            if (language === 'ENGLISH' && from.country !== null) {
                newTweetArray = analyzeTwitterText(tweet, travelWords, jsonData, from);
                for (var i = 0; i < newTweetArray.length; i++) {
                    console.log(newTweetArray[i])
                    cb(newTweetArray[i]);
                }
            }
        }
    });
}

// only anlayze tweet from Australia 
function locationDetect(tweet, jsonData) {
    var location = tweet.location;
    // convert location to array
    var userLocations = location.split(', ');
    var from = {
        country: null,
        state: null,
        city: null
    };
    var australiaLocations = generateAustraliaLocations(jsonData);
    // store state and city
    for (var i = 0; i < userLocations.length; i++) {
        var userLocationLowerCase = userLocations[i].toLowerCase();
        if (_.indexOf(australiaLocations.country, userLocationLowerCase) > -1) {
            from.country = userLocationLowerCase;
        }
        if (_.indexOf(australiaLocations.states, userLocationLowerCase) > -1) {
            from.state = userLocationLowerCase;
        }
        if (_.indexOf(australiaLocations.cities, userLocationLowerCase) > -1) {
            from.city = userLocationLowerCase;
        }
    }

    if (from.state === null && from.city !== null) {
        var australiaJson = jsonData[AUSTRALIA];
        var states = _.keys(australiaJson);
        for (var i = 0; i < states.length; i++) {
            var cities = _.keys(australiaJson[states[i]]);
            var citiesLowerCase = convertToLowerCase(cities);
            if (_.indexOf(citiesLowerCase, from.city) > -1) {
                from.state = states[i].toLowerCase();
                from.country = AUSTRALIA;
            }
        }
    } else if (from.state !== null) {
        from.country = AUSTRALIA;
    }
    return from;
}

// seperate twitter text into tokens
function analyzeTwitterText(tweet, travelWords, jsonData, fromLocation) {
    var analyzedResult = sentiment(tweet.text);
    var score = analyzedResult.score;
    var tokens = analyzedResult.tokens;
    var newTweetArray = [];
    // get intersection between tokens and pre-defined words list
    var intersection = _.intersection(tokens, travelWords);
    if (intersection.length === 0) {
        return newTweetArray;
    } else {
        var attitude = '';
        score >= 0 ? attitude = 'positive' : attitude = 'negative'
        // construct new data
        for (var i = 0; i < tweet.keywords.length; i++) {
            var keyword = tweet.keywords[i].toLowerCase();
            var result = findKeyword(jsonData, keyword);
            if (result.continent !== null || result.state !== null || result.country !== null || result.city !== null) {
                var newTweet = {
                    attitude: attitude,
                    to: {
                        continent: result.continent,
                        state: result.state,
                        country: result.country,
                        city: result.city,
                    },
                    from: fromLocation,
                    overseas: result.overseas
                };
                newTweetArray.push(newTweet);
            }
        }
        return newTweetArray;
    }
}

exports.analyze = analyze;