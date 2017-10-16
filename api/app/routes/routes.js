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
    console.log(req.query);
    res.send('Hello');
  });

  app.get('/sendImage', (req, res) => {
    db.sendImage(undefined);
    res.send('nothing');
  });

  app.get('/getImage', (req, res) => {
  });
};
