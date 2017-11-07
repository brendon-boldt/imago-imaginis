const stylizer = require('../stylizer');
const db = require('../db');
//const request = require('request');
const request = require('request-promise-native');
const fs = require('fs');

const config = require('../../config.js');

const log = (msg) => {console.log("ROUTES: " + msg)};

module.exports = function(app) {

  app.get('/test/doRun', async (req, res) => {
    // User - photo ID
    let upId = [33, 47];
    let runInfoBuf = await db.selectRun(upId);
    let runInfo = JSON.parse(runInfoBuf)[0];
    let promContentFPath = db.selectImage('content',runInfo.unfiltered_photo_id);
    let promStyleFPath = db.selectImage('style',runInfo.filter_id);
    let contentFPath = await promContentFPath;
    let styleFPath = await promStyleFPath;
    log(contentFPath);
    log(styleFPath);

    let upIdString = upId[0] + '-' + upId[1];
    //let outputFPath = `${config.outputPath}/${runInfo.photo_id}.jpg`;
    let testRunParams = {
      upId : upIdString,
      photo_id : runInfo.photo_id,
      contentPath : contentFPath,
      contentSize : 16,
      stylePath : styleFPath,
      styleSize : 16,
      outputName : `${runInfo.photo_id}.jpg`
    };

    let outputFPath = await stylizer.startStyle(testRunParams);

    await db.insertImage(outputFPath, runInfo.photo_id);
    res.send('the end!');
  });

};
