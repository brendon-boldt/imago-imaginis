const fs = require('fs');
const request = require('request');
const config = require('../../config.js');

const getImagePath = 'getImage';
const sendImagePath = 'sendImage';
const getRunPath = 'getRun';
const sendRunPath = 'sendRun';

const log = (msg) => {console.log("DB: " + msg)};

module.exports = {

  // Retrieve an image from the database
  getImage: async function(imageId) {
    let options = {
      url: config.dbUrl + getImagePath,
      method: 'GET',
      encoding: null,
      qs: { imageId: imageId }
    };

    request(options, (err, res, body) => {
      fs.writeFile(`${config.imageDir}recieved-${imageId}.jpg`, body, () => {
        // Action after file is written
        if (err) {
          // On file write error
          log(err);
        }
      });
    });
  },

  // Load an image into the database
  sendImage: async function(imageId) {
    fs.readFile(`${config.imageDir}image-${imageId}.jpg`, (err, data) => {
      if (err) {
        console.log(`Could not read image with id ${image.imageId}.`);
        return;
      }
      options = { 
        body: data,
        url: `http://localhost:8001/${sendImagePath}`,
        encoding: null,
        method: 'POST',
        headers: { 'Content-Type': 'application/octet-stream'},
        qs: { imageId: imageId }

      };
      request(options, (err, res, body) => {
        if (err) {
          log(err);
        }
        console.log('send complete');
      });
    });
  },

  // Get run information from database
  getRun: async function(runId) {
    // Sample data

    let requestSettings = {
      url: config.dbUrl + getImagePath,
      method: 'GET',
      encoding: null,
      qs: { runId: runId }
    };

    request(requestSettings, (err, res, body) => {
      if (err) {
        // Action on error
        log(err);
      }
      console.log(body);
      return body;
    });

    /*
    let runParams = {
      runId : 2401,
      contentPath : config.imageDir + 'cornell.jpg',
      contentSize : 32,
      stylePath : config.imageDir + 'woman_in_peasant_dress.jpg',
      styleSize : 32
    };
    return runParams;
    */
  },

  // Send run information to database
  sendRun: async function(run) {
    options = { 
      body: run,
      url: `http://localhost:8001/${sendImagePath}`,
      encoding: null,
      method: 'POST',
      headers: { 'Content-Type': 'application/json'}
    };
    request(options, (err, res, body) => {
      console.log('send complete');
    });
  }
}
