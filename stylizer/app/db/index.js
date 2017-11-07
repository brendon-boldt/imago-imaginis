const fs = require('fs');
//const request = require('request');
const request = require('request-promise-native');
const config = require('../../config.js');
const stylizer = require('../stylizer');

const selectImagePath = 'style/selectImage';
const insertImagePath = 'style/insertImage';
const selectRunPath = 'style/selectRun';
const selectRunsPath = 'style/selectRuns';
//const insertRunPath = 'style/insertRun';

const log = (msg) => {console.log("DB: " + msg)};

module.exports = {

  /**
   * Retrieve an image from the database
   * type: [ 'content' | 'style' ]
   */
  selectImage: async function(imageType, photo_id) {
    let options = {
      form: {
        photo_id: photo_id,
        type: imageType
      },
      url: config.dbUrl +'/'+ selectImagePath,
      method: 'POST',
      encoding: null,
      headers: { 'Content-Type': 'multipart/form-data'}
    };

    let filename = 'UNSET';
    if (imageType === 'content') {
      filename = `${config.contentPath}/${photo_id}.jpg`;
    } else if (imageType === 'style') {
      filename = `${config.stylePath}/${photo_id}.jpg`;
    } else {
      throw new Error('Unknown type: ' + imageType);
    }
    await request(options, async (err, res, body) => {

      // TODO: The error handling here does not work for DB side error
      if (err) {
        log(err);
        return;
      } else if (body.length === 0) {
        log ("ERROR: Empty file received.");
        return;
      }
      
      log(`Writing ${filename}`);
      await fs.writeFile(filename, body, (err) => {
        if (err) {
          log(err);
          return -1;
        }
        return;
      });
      return;
    });
    return filename;
  },

  // Load an image into the database
  insertImage: async function(outputFPath, runInfo) {
    //let imagePath = `${config.outputPath}/${photo_id}.jpg`;
    fs.readFile(outputFPath, async (err, data) => {
      if (err) {
        console.log(`Could not read image ${outputFPath}.`);
        return;
      }

      options = { 
        form: {
          imageData: data,
          photo_id: runInfo.photo_id,
          user_id: runInfo.user_id
        },
        url: `${config.dbUrl}/${insertImagePath}`,
        encoding: null,
        method: 'POST',
        headers: { 'Content-Type': 'multipart/form-data'},
      };

      await request(options, (err, res, body) => {
        if (err) {
          log(err);
        }
        console.log('send complete');
      });
    });

    return 0;
  },

  // Get run information from database
  selectRun: async function(upId) {
    let options = {
      form: { user_id: upId[0], photo_id: upId[1] },
      url: config.dbUrl +'/'+ selectRunPath,
      method: 'POST',
      encoding: null,
      headers: { 'Content-Type': 'multipart/form-data'}
    };

    let result = await request(options, (err, res, body) => {
      if (err) {
        log(err);
        return;
      } else if (body.length === 0) {
        log ("ERROR: Empty response received.");
        return;
      }
      return body;
    });

    return result;
  },

  // Multiple runs
  selectRuns: async function(upId) {
    let options = {
      form: {},
      url: config.dbUrl +'/'+ selectRunsPath,
      method: 'POST',
      encoding: null,
      headers: { 'Content-Type': 'multipart/form-data'}
    };

    let result = await request(options, (err, res, body) => {
      if (err) {
        log(err);
        return;
      } else if (body.length === 0) {
        log ("ERROR: Empty response received.");
        return;
      }
      return body;
    });

    return result;
  },

  getRuns: async function() {
    let upId = [33, 47];
    let runInfoBuf = await this.selectRuns();
    let runInfoArr = JSON.parse(runInfoBuf);

    let R = runInfoArr;
    for (let i = 0; i < R.length; ++i) {
      // If is only for testing
      if (R[i].unfiltered_photo_id >= 33 && R[i].unfiltered_photo_id <= 40) {
        this.doRun(R[i]);
        break;
      }
    }
    //this.doRun(runInfo);
  },

  // Send run information to database
  doRun: async function(runInfo) {
    // User - photo ID
    let promContentFPath = this.selectImage('content',runInfo.unfiltered_photo_id);
    let promStyleFPath = this.selectImage('style',runInfo.filter_id);
    let contentFPath = await promContentFPath;
    let styleFPath = await promStyleFPath;
    log(contentFPath);
    log(styleFPath);

    let upIdString = runInfo.user_id + '-' + runInfo.photo_id;
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

    await this.insertImage(outputFPath, runInfo);
  }
}
