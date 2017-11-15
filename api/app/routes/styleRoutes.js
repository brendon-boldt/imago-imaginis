const db = require('../db');
const path = require('path');
const fs = require('fs');
const formDataModule = require('form-data');


const config = require('../../config.js');

module.exports = function(app) {
  app.post('/style/insert/:type*', async (req, getres) => {
    console.log("Upload of type: " + req.params.type);

    let filepath = `${config.outputPath}/output-${req.query.resource_id}.${req.query.fileType}`; 
    console.log(`Writing file: ${filepath}`);
    fs.writeFile(filepath, req.body, (err) => {
        if (err) {
          throw err;    
        }
        getres.json({'status': 0});
      });

    let resource_id = parseInt(req.query.resource_id);
    console.log(resource_id);
    let user_id = parseInt(req.query.user_id);
    let path = config.resultPath;
    let photosQuery = `UPDATE photos SET path = '${filepath}' WHERE photo_id = ${resource_id}`;
    console.log(photosQuery); 
    db.query(photosQuery); 

let user_photoQuery = `UPDATE user_photo SET status='done' WHERE photo_id=${resource_id} AND user_id=${user_id}`;
    console.log(user_photoQuery); 
    db.query(user_photoQuery); 
    return 0;
  });



  app.post('/style/select/image', (req, res) => {
    console.log("Received: ", req.body);
    let filepath = 'UNSET';
    if (req.body.type === 'content') {
    // TODO: This should be its own route, but I do not have time for that now
      filepath = `${config.contentPath}/upload-${req.body.resource_id}.${req.body.fileType}`;
      let processingQuery = `UPDATE user_photo SET status='processing' WHERE unfiltered_photo_id=${req.body.resource_id}`;
      console.log(processingQuery); 
      db.query(processingQuery); 
    } else
      filepath = `${config.stylePath}/filter-${req.body.resource_id}.${req.body.fileType}`;
    console.log('Sending: ' + filepath);
    res.sendFile(filepath);
  });

  app.post('/style/select/run', (req, getres) => {
    let user_id = parseInt(req.body.user_id);
    let photo_id = parseInt(req.body.photo_id);
    let queryText =
      `SELECT * FROM user_photo WHERE user_id=${user_id} AND photo_id=${photo_id}`;

    console.log("QUERYING: " + queryText);
    db.query(queryText)
      .then(res => {
        console.log(res.rows);
        getres.send(res.rows);
      })
      .catch(e => console.error(e.stack));

    return 0;
  });

  // Multiple runs
  app.post('/style/select/runs', (req, getres) => {
    let user_id = parseInt(req.body.user_id);
    let photo_id = parseInt(req.body.photo_id);
    let queryText =
      'SELECT photo_id, user_id, unfiltered_photo_id, filters.filter_id, unfiltered_photo.path AS uppath, filters.path AS fpath FROM user_photo NATURAL JOIN unfiltered_photo JOIN filters ON (filters.filter_id = user_photo.filter_id) WHERE status=\'waiting\'';

    console.log("QUERYING: " + queryText);
    db.query(queryText)
      .then(res => {
        console.log(res.rows);
        getres.send(res.rows);
      })
      .catch(e => console.error(e.stack));

    return 0;
  });


};

