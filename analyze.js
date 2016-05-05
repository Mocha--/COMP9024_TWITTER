var sentiment = require('sentiment');
var cld = require('cld');
var _ = require('lodash');
var jsonData = require('./locations/travel');

var travelWords = ['airfare', 'airplane', 'airplanes', 'airport', 'airports', 'automobile', 'automobiles',
    'backpack', 'backpacks', 'baggage', 'baggages', 'bag', 'beaches', 'bicycles', 'bikes', 'boats', 'buses',
    'bags', 'beach', 'bicycle', 'bike', 'binoculars', 'boat', 'bus', 'cab', 'cabs', 'cabin', 'cabins', 'camera',
    'cameras', 'campground', 'campgrounds', 'camping', 'campings', 'car', 'cars', 'carry-on', 'chart', 'charts',
    'coast', 'coasts', 'cruise', 'cruises', 'currency', 'customs', 'depart', 'departed', 'departure', 'departures',
    'destination', 'destinations', 'downtime', 'drive', 'drove', 'driven', 'embark', 'embarked', 'excursion',
    'expedition', 'explore', 'explored', 'ferry', 'flew', 'flight', 'fly', 'foreign', 'foreigner', 'garment',
    'getaway', 'go', 'went', 'guide', 'guided', 'hiatus', 'highway', 'hike', 'hiked', 'holiday', 'holidays',
    'hostel', 'hostels', 'hotel', 'hotels', 'inn', 'inns', 'island', 'islands', 'itinerary', 'jet', 'jets',
    'journey', 'keepsake', 'keepsakes', 'knapsack', 'knapsacks', 'lake', 'lakes', 'landing', 'landings', 'leave',
    'left', 'leisure', 'lodge', 'lodges', 'lodging', 'luggage', 'luggages', 'map', 'maps', 'motel', 'motels',
    'mountains', 'mountain', 'museum', 'museums', 'national', 'liner', 'outdoors', 'overnight', 'pack', 'passage',
    'passport', 'passports', 'photo', 'photos', 'photograph', 'photographs', 'picture', 'pictures', 'plane',
    'planes', 'port', 'ports', 'postcard', 'postcards', 'recreation', 'relax', 'relaxed', 'relaxation', 'reservations',
    'reservation', 'resort', 'resorts', 'rest', 'restaurant', 'restaurants', 'return', 'returned', 'ride', 'room', 'rooms',
    'sack', 'safari', 'sail', 'scenery', 'schedule', 'scheduled', 'sea', 'seashore', 'ship', 'ships', 'shore', 'sights',
    'souvenir', 'souvenirs', 'stand-by', 'station', 'stay', 'stayed', 'subway', 'subways', 'suitcase', 'suitcases',
    'sunscreen', 'swim', 'swam', 'swimsuit', 'takeoff', 'taxi', 'tent', 'tents', 'ticket', 'tickets', 'tip', 'tips',
    'tote', 'tour', 'tours', 'tourist', 'tourists', 'trail', 'train', 'trains', 'tram', 'trams', 'tramway', 'translate',
    'translated', 'transportation', 'travel', 'travelled', 'traveled', 'traveling', 'travelling', 'trip', 'trips', 'trunk',
    'umbrella', 'umbrellas', 'unpack', 'vacation', 'vehicle', 'vehicles', 'video', 'videos', 'visa', 'visit', 'visited',
    'voyage', 'walk', 'walked', 'wander', 'wandered', 'waterfall', 'waterpack', 'weekend', 'yacht', 'zoo'
];

const AUSTRALIA = 'australia';
const OCEANIA = 'oceania';

// generate Australia locations
function generateAustraliaLocations(jsonData) {
    var locations = [AUSTRALIA];
    var australiaJson = jsonData[AUSTRALIA];
    var states = _.keys(australiaJson);
    // store states
    locations = locations.concat(states);
    for (var i = 0; i < states.length; i++) {
        var cities = _.keys(australiaJson[states[i]]);
        // store cities
        locations = locations.concat(cities);
    }
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
        } else {
            result.continent = keyword;
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
                    return result;
                } else {
                    // city level
                    for (var j = 0; j < countries.length; j++) {
                        if (_.indexOf(convertToLowerCase(jsonData[continents[i]][countries[j]]), keyword) != -1) {
                            // keyword is a city
                            result.continent = continentsLowerCase[i];
                            result.country = countriesLowerCase[j];
                            result.city = keyword;
                            return result;
                        }
                    }
                }
            } else {
                var states = _.keys(jsonData[continents[i]]);
                var statesLowerCase = convertToLowerCase(states);
                if (_.indexOf(statesLowerCase, keyword) != -1) {
                    // keyword is a state
                    result.continent = OCEANIA;
                    result.country = AUSTRALIA;
                    result.state = keyword;
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
                            return result;
                        } else {
                            for (var k = 0; k < cities.length; k++) {
                                if (_.indexOf(convertToLowerCase(jsonData[continents[i]][states[j]][cities[k]]), keyword) != -1) {
                                    // keyword is an attraction
                                    result.continent = OCEANIA;
                                    result.country = AUSTRALIA;
                                    result.state = statesLowerCase[j];
                                    result.city = citiesLowerCase[k];
                                    return result;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

// read tweet from database
function readTweet() {
    // userName, screeNname, created, location, retweetCount, text, keywords
    return tweet;
}

// only analyze tweet in English
function languageDetect(tweet, travelWords, jsonData) {
    cld.detect(tweet.text, function(err, result) {
        if (!err) {
            // get language
            var language = result.languages[0].name;
            // analyze tweet from Australian
            if (language === 'ENGLISH' && locationDetect(tweet, jsonData)) {
                analyzeTwitterText(tweet, travelWords, jsonData);
            } else {
                if (language !== 'ENGLISH') {
                    console.log("Language is not English, it is " + language);
                } else {
                    console.log("User does not come from Australia, he or she comes from " + tweet.location);
                }
            }
        } else {
            console.log(err);
        }
    });
}

// only anlayze tweet from Australia 
function locationDetect(tweet, jsonData) {
    var location = tweet.location;
    // convert location to array
    var userLocations = location.split(', ');
    var australiaLocations = generateAustraliaLocations(jsonData);
    // convert strings to lower case
    var userLocationsLowerCase = convertToLowerCase(userLocations);
    var australiaLocationsLowerCase = convertToLowerCase(australiaLocations);
    // get intersection between user location and pre-defined Austraila locations
    var intersection = _.intersection(userLocationsLowerCase, australiaLocationsLowerCase);
    if (intersection.length > 0) {
        return true;
    } else {
        return false;
    }
}

// seperate twitter text into tokens
function analyzeTwitterText(tweet, travelWords, jsonData) {
    var analyzedResult = sentiment(tweet.text);
    var score = analyzedResult.score;
    var tokens = analyzedResult.tokens;
    // get intersection between tokens and pre-defined words list
    var intersection = _.intersection(tokens, travelWords);
    if (intersection.length === 0) {
        console.log('This twitter is not about travel.');
    } else {
        var attitude = '';
        score >= 0 ? attitude = 'positive' : attitude = 'negative'
        // construct new data
        for (var i = 0; i < tweet.keywords.length; i++) {
            var keyword = tweet.keywords[i].toLowerCase();
            var result = findKeyword(jsonData, keyword);
            var overseas = false;
            result === AUSTRALIA ? overseas = false : overseas = true
            var newTweet = {
                attitude: attitude,
                to: {
                    continent: result.continent,
                    state: result.state,
                    country: result.country,
                    city: result.city,
                },
                from: tweet.location,
                overseas: overseas
            };
            writeTweet(newTweet);
        }
    }
}

function writeTweet(tweet) {
    console.log(tweet);
}

// get the tweet
// var tweet = readTweet();
// analyze the tweet
// languageDetect(tweet, travelWords, jsonData);
var tweets = [{
    text: "MELBOURNE IS GOOD, and I want to fly to SYDNEY!",
    keywords: ["MELBOURNE", 'Sydney'],
    location: "Mornington Peninsula, Australia"
}, {
    text: "I flew to Beijing last week, and will go to Paro next month",
    keywords: ['Beijing', 'Paro'],
    location: "Victoria"
}, {
    text: 'RT @akyakyakya: うれピーマン＼(^o^)／RT @OralJOE: JAPAN JAM オーラルの物販ダントツで列エグいみたいやんけーー！！最高ですっ！BKW！今から向かうぞー(*☻-☻*) https://t.co/HysvQD2zVM',
    keywords: ['japan'],
    location: "Japan"
}, {
    text: 'RT @abhijitmajumder: Intolerance in India rising, says USCIRF, a body created by US to preach to others while back home rages a black-n-whi',
    keywords: ['india'],
    location: "China"
}, {
    text: 'Eu não consigo falar só uma coisa, quando eu falo eu embalo e não paro mais isso é muito chato',
    keywords: ['paro'],
    location: "Melbourne"
}, {
    text: "@Remilucy92 That's great! Now in wangfujing this week is golden week, national holiday.",
    keywords: ['wangfujing'],
    location: "New South Wales"
}, {
    text: 'Aw karon kantahon sag "See you again" but hopefully balikan sad kag "Im coming home" hahahahaha ok rna oy',
    keywords: ['karon'],
    location: "America"
}];

for (var i = 0; i < tweets.length; i++) {
    languageDetect(tweets[i], travelWords, jsonData);
}