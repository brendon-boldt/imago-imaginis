const stylizer = require('../stylizer');
const db = require('../db');
//const request = require('request');
const request = require('request-promise-native');
const fs = require('fs');

const config = require('../../config.js');

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

  app.get('/test/insertImage', (req, res) => {
    db.insertImage(2401);
    res.send('done');
  });

  app.get('/test/selectImage', (req, res) => {
    db.selectImage(1509420501508);
    res.send('done');
  });

  app.get('/test/styleImage', async (req, res) => {
    let imageId = 1509420501508;
    await db.selectImage(imageId);

    let runId = 2401;
    let testRunParams = {
      runId : runId,
      contentPath :
        `${config.contentPath}/upload-${imageId}.jpg`,
      contentSize : 16,
      stylePath :
        `${config.stylePath}/filter-0.jpg`,
      styleSize : 16,
      outputName :
        `output-${runId}.jpg`
    };

    await stylizer.startStyle(testRunParams);

    await db.insertImage(runId);
    res.send('the end!');
  });
};
