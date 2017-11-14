const db = require('../db');
const path = require('path');
const fs = require('fs');
const formDataModule = require('form-data');


const config = require('../../config.js');

module.exports = function(app) {
  app.post('/style/insertImage*', /*multer({storage: storage}).single("upload"),*/ async (req, getres) => {
    console.log("POST - style upload");

    let filepath = `${config.outputPath}/output-${req.query.photo_id}.jpg`; 
    console.log(`Writing file: ${filepath}`);
    fs.writeFile(filepath, req.body, (err) => {
        if (err) {
          throw err;    
        }
        getres.json({'status': 0});
      });

    ///let filter_id = parseInt(req.body.filter_id);
    /*

UPDATE user_photo SET status='done' WHERE photo_id=47 AND user_id=33;

     */

    let photo_id = parseInt(req.query.photo_id);
    let user_id = parseInt(req.query.user_id);
    let path = config.resultPath;
    let photosQuery = `UPDATE photos SET path = '${filepath}' WHERE photo_id = ${photo_id}`;
    console.log(photosQuery); 
    db.query(photosQuery); 

let user_photoQuery = `UPDATE user_photo SET status='done' WHERE photo_id=${photo_id} AND user_id=${user_id}`;
    console.log(user_photoQuery); 
    db.query(user_photoQuery); 
    return 0;
  });



  app.post('/style/selectImage', (req, res) => {
    console.log("Received: ", req.body);
    let filepath = 'UNSET';
    if (req.body.type === 'content')
      filepath = `${config.contentPath}/upload-${req.body.photo_id}.jpg`;
    else
      filepath = `${config.stylePath}/filter-${req.body.photo_id}.jpg`;
    console.log('Sending: ' + filepath);
    res.sendFile(filepath);
  });

  app.post('/style/selectRun', (req, getres) => {
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
  app.post('/style/selectRuns', (req, getres) => {
    let user_id = parseInt(req.body.user_id);
    let photo_id = parseInt(req.body.photo_id);
    let queryText =
      'SELECT * FROM user_photo NATURAL JOIN unfiltered_photo WHERE status=\'waiting\'';

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

