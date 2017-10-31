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
      cb(null, '/home/administrator/files/images/uploads')
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
    // Create a new entry in the database in Unfiltered_Photo
    var path = "/home/administrator/files/images/uploads/" + req.file.filename;
    let queryText = "INSERT INTO unfiltered_photo (size, height, width, path) VALUES (3.0, 264, 264, '" + path + "') RETURNING unfiltered_photo_id;";
    console.log("Query: " + queryText);
    var unfiltered_photo_id = db.query(queryText);
    // Need to generate entry in Photos to have photo id so we can create entry in user_photo
    queryText = "INSERT INTO photos (size, creation_date, path, process_time, flag, display, height, width) VALUES (.00000001, '1970-01-01', '', 0, false, false, 0, 0);";
    console.log("Query: " + queryText);
    db.query(queryText); 
    // We also need to create a new entry in User_Photo. Need to use generated unfiltered_photo_id
    queryText = "INSERT INTO user_photo (filter_id, unfiltered_photo_id, status, wait_time) VALUES (" + req.query.filter_id + ", " + unfiltered_photo_id + ", waiting, 0);";
    console.log("Query: " + queryText);
    db.query(queryText); 
  });
};