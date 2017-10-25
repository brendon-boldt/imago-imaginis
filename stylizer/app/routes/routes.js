const stylizer = require('../stylizer');
const db = require('../db');
const request = require('request');
const fs = require('fs');

const log = (msg) => {console.log("ROUTES: " + msg)};

module.exports = function(app) {
  
  app.get('/', async (req, res) => {
    const runParams = db.getRun(2401);
    let response;
    try {
      response = await stylizer.startStyle(runParams);
    } catch (err) {
      throw err;
    }
    res.json({ message : response });

  })

  app.post('/test', (req, res) => {
    log(req.query);
    res.send('done');
  });

  app.get('/test/sendImage', (req, res) => {
    db.sendImage(2401);
    res.send('done');
  });

  app.get('/test/getImage', (req, res) => {
    db.getImage(2401);
    res.send('done');
  });
};
