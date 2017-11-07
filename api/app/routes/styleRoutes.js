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
      //res.send();
    //});
    return;

    let path = config.resultPath;
    let queryText = "INSERT INTO photos (filter_id, size, creation_date, path, process_time) VALUES (2, 3.0, '2017-10-18', '" + path + "', 5)";
    console.log(queryText);
    db.no_param_query(queryText); 
  });

  app.post('/style/selectImage', (req, res) => {
    console.log("Received: ", req.body);
    console.log('Sending: ' + `${config.contentPath}/upload-${req.body.imageId}.jpg`);
    res.sendFile(`${config.contentPath}/upload-${req.body.imageId}.jpg`);
  });



};

