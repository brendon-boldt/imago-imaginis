const db = require('../db');
const multer = require('multer'); 
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt  = require('bcrypt');

module.exports = function(app) {
  
  /**
   * Test route
   */
  app.post('/test', (req, res) => {
    console.log(req.query);
    res.send('Hello');
  });

  /**
   * Returns all filter ids and their names
   */
  app.get('/filters', (req, getres) => {
    console.log("GET - filters");
    let queryText = 'SELECT * FROM filters';
    db.query(queryText)
      .then(res => {
        console.log(res.rows);
        getres.send(res.rows);
      })
      .catch(e => console.error(e.stack))
  });

  /**
   * Performs a photo upload
   * https://github.com/expressjs/multer/issues/170
   */
  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'C:/Users/KaiWong/')
    },
    filename: function (req, file, cb) {
        var filename = file.fieldname + '-' + Date.now() + path.extname(file.originalname)
        cb(null, filename);
    }
  });
  app.post('/upload', multer({storage: storage}).single("upload"), (req, getres) => {
    // Do verification that this is indeed a photo upload
    console.log("POST - upload");
    console.log(req.file);
    getres.send(req.file);
    // Create a new entry in the database in Photos
    var path = "somepath\\" + req.file.path;
    let queryText = "INSERT INTO photos (filter_id, size, creation_date, path, process_time) VALUES (" + req.query.filter_id + ", 3.0, '2017-10-18', '" + path + "', 5)";
    console.log("Query: " + queryText);
    db.query(queryText); 
  });
};