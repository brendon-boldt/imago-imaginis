const db = require('../db');
const path = require('path');
const fs = require('fs');

const config = require('../../config.js');


module.exports = function(app) {
  app.post('/style/insertImage', /*multer({storage: storage}).single("upload"),*/ (req, getres) => {
    console.log("POST - style upload");
    getres.json({'status': 0});
    fs.writeFile(`${config.outputPath}/output-${req.body.imageId}.jpg`,
        req.body.imageData, (err) => {
        if (err) {
          throw err;    
        }
      });

    ///let filter_id = parseInt(req.body.filter_id);

    let path = config.resultPath;
    let queryText = `UPDATE ...`;
    console.log(queryText);
    db.query(queryText); 
  });
  
  app.post('/style/insertRun', /*multer({storage: storage}).single("upload"),*/ (req, getres) => {
    console.log("POST - style upload");
    getres.json({'status': 0});

    let path = config.resultPath;
    let queryText = `UPDATE ...`;
    console.log(queryText);
    db.query(queryText); 
  });




  app.post('/style/selectImage', (req, res) => {
    console.log("Received: ", req.body);
    console.log('Sending: ' + `${config.contentPath}/upload-${req.body.imageId}.jpg`);
    res.sendFile(`${config.contentPath}/upload-${req.body.imageId}.jpg`);
  });

  app.post('/style/selectRun', (req, res) => {
    let user_id = parseInt(req.body.user_id);
    let photo_id = parseInt(req.body.photo_id);
    let queryText =
      `SELECT * FROM user_photo WHERE user_id=${user_id} AND photo_id=${photo_id}`;

    console.log("QUERYING: " + queryText);
    db.query(queryText)
      .then(res => {
        console.log(res.rows);
        res.send(res.rows);
      })
      .catch(e => console.error(e.stack))

    return 0;
    /*
    let queryText = 'SELECT * FROM filters';
    db.query(queryText)
      .then(res => {
        console.log(res.rows);
        getres.send(res.rows);
      })
      .catch(e => console.error(e.stack))
     */
  });


};

