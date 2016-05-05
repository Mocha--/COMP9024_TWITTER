'use strict';

let nano = require('nano')('http://115.146.85.141:5984/');
let testDB = nano.use('mapreducetest');

// testDB.insert({
//     lanuage: 'javascript',
//     views: {
//         testView1: {
//             map: function(doc) {
//                 emit(1, 2);
//             },
//             reduce: function(key, value) {
//                 return sum(value)
//             }
//         }
//     }
// }, '_design/test1', function(err, res) {
//     console.log(err);
// })

testDB.view('test1', 'testView1', function(err, res){
    console.log(res);
})
