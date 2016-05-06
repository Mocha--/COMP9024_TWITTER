'use strict';

let agent = require('superagent');
let fs = require('fs');
let analyzeService = require('./analyzeService');
let travelWords = require('./constant/travelWords');
let travelJson = require('./constant/locations/travel');
let nano = require('nano')('http://115.146.85.141:5984');
let writeDb = nano.use('travel_stats');

const clientsNum = 10;
const myRank = parseInt(process.argv[2]);
let processedNum = 0;
let turns = 0;

if (myRank > clientsNum) {
    console.log('my rank cant be bigger than total clients number!!');
    process.exit(1)
}

const limitNum = 1;
const targetUrl = 'http://115.146.85.141:5984/twittes/_all_docs';
const totalDocNum = 36306367;

let startDocId = undefined;

let processDataRecursively = function(startDocId) {
    let skipNum = startDocId === undefined ? limitNum * (myRank - 1): limitNum * (clientsNum - 1) + 1;

    agent
        .get(targetUrl)
        .set('Accept', 'application/json')
        .query({
            limit: limitNum,
            skip: skipNum,
            include_docs: true,
            startkey_docid: startDocId
        })
        .end(function(err, res) {
            let offset = res.body.offset;
            if (offset <= totalDocNum - 10000) {
                let rows = res.body.rows;
                // console.log(rows);
                // console.log('----------------');
                let lastDoc = rows[rows.length - 1];
                for (let doc of rows) {
                    analyzeService.analyze(doc.doc, travelWords.list, travelJson, console.log);
                    processedNum = processedNum + 1;
                    console.log(processedNum)
                    if(processedNum == 10000) {
                        turns = turns + 1;
                        fs.open('processLog.txt', 'a', function (e, fd) {
                            fs.write(fd, turns * 10000 + ' ' + new Date() + '\n', function (e) {
                                if(!e) {
                                    processedNum = 0;
                                }
                            });
                        });
                    }
                }

                processDataRecursively(lastDoc.id)
            }
        })
}

processDataRecursively(startDocId);
