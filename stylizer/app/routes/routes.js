const stylizer = require('../stylizer');
const db = require('../db');
//const request = require('request');
const request = require('request-promise-native');
const fs = require('fs');

const config = require('../../config.js');

const log = (msg) => {console.log("ROUTES: " + msg)};

db.startWatching();

module.exports = function(app) {

  app.get('/test/doRun', async (req, res) => {
    db.getRuns();
    res.send('the end!');
  });

};
