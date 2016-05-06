'use strict';

let agent = require('superagent');
let fs = require('fs');

const clientsNum = 1;
const myRank = parseInt(process.argv[2])

if (myRank > clientsNum) {
    console.log('my rank cant be bigger than total clients number!!');
    process.exit(1)
}

const limitNum = 1;
const targetUrl = 'http://115.146.85.141:5984/twittes/_all_docs';
const totalDocNum = 36306367;

let startDocId = undefined;

let processDataRecursively = function(startDocId) {
    let skipNum = startDocId === undefined ? limitNum * (myRank - 1) : limitNum * (clientsNum - 1) + 1;

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
                    // TODO: analyze and then insert results to db
                }

                processDataRecursively(lastDoc.id)
            }
        })
}

processDataRecursively(startDocId);
