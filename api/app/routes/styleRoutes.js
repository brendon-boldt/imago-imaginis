const db = require('../db');
const path = require('path');
const fs = require('fs');

const insertImagePath = '/tmp/ii/style/upload/';

module.exports = function(app) {
  app.post('/style/insertImage', /*multer({storage: storage}).single("upload"),*/ (req, getres) => {
    console.log("POST - style upload");
    getres.json({'status': 0});
    let path = insertImagePath;
    fs.writeFile(`${insertImagePath}image-${req.body.imageId}.jpg`,
        req.body, () => {
      //res.send();
    });

    let queryText = "INSERT INTO photos (filter_id, size, creation_date, path, process_time) VALUES (2, 3.0, '2017-10-18', '" + path + "', 5)";
    console.log(queryText);
    db.no_param_query(queryText); 
  });

  app.post('/style/selectImage', (req, res) => {
    imagePath = '/tmp/ii/style/download/';
    console.log("Received: ", req.body);
    console.log('Sending: ' + `${imagePath}image-${req.body.imageId}.jpg`);
    res.sendFile(`${imagePath}image-${req.body.imageId}.jpg`);
  });



};

