const db = require('../db');
const multer = require('multer'); 
const path = require('path');
const jwt = require('jsonwebtoken');

const config = require('../../config.js');

// const uploadsPath = '/images/uploads/';
// const uploadsPath = '/home/administrator/files/images/uploads/';
// const uploadsPath = 'C:/Users/KaiWong/';

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
    let queryText = 'SELECT * FROM filters WHERE preset = true';
    db.query(queryText)
      .then(res => {
        console.log(res.rows);
        getres.send(res.rows);
      })
      .catch(e => console.error(e.stack))
  });

  
  /**
   * Get filter path based on passed filter_id
   * Takes in the request query's parameters
   */
  app.get('/filter', (req, getres) => {
    console.log("GET - filter path for id");
    var id = req.query.id;
    let queryText = "SELECT path FROM FILTERS WHERE filter_id = " + id;
    db.query(queryText)
        .then(res => {
            console.log(res.rows);
            getres.send(res.rows);
        })
        .catch(e => console.error(e.stack))
  });

  /**
     * Set a photo as reported on passed photo_id
     * Takes in the request body's parameters
     */
  app.post('/report/photo', (req, getres) => {
    console.log("POST - set photo reported with id");
    var id = req.body.id;
    var queryText = "UPDATE PHOTOS SET flag = TRUE WHERE photo_id = '" + id + "';";
    db.query(queryText)
        .then(res => {
            if (res != undefined) {
                console.log("Photo flagging successful!");
                getres.send("Photo flagging successful!");
            } else {
                getres.send("Photo flagging failed");
            }
        })
        .catch(e => console.error(e.stack))
  });

  /**
   * Performs a photo upload
   * https://github.com/expressjs/multer/issues/170
   */
  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, config.uploadsPath)
    },
    filename: async function (req, file, cb) {
        // Insert new entry into the database and use the unfiltered photo ID as filename
        let queryText = "INSERT INTO unfiltered_photo (size, height, width, path) VALUES (0, 264, 264, '') RETURNING unfiltered_photo_id;";
        console.log("Query: " + queryText);
        var result = await db.query(queryText);
        var unfiltered_photo_id = result.rows[0].unfiltered_photo_id;
        file.unfiltered_photo_id = unfiltered_photo_id;
        var filename = file.fieldname + '-' + unfiltered_photo_id + path.extname(file.originalname);
        cb(null, filename);
    }
  });
  app.post('/upload', multer({storage: storage}).single("upload"), (req, getres) => {
    // Do verification that this is indeed a photo upload
    console.log("POST - upload");
    console.log(req.file);
    getres.send(req.file);
    async function test() {
      var path = config.uploadsPath + "/" + req.file.filename;
      // Update record in DB to have file size and path
      let queryText = "UPDATE unfiltered_photo SET (size, path) = (" + req.file.size + ", '" + path + "') WHERE unfiltered_photo_id = " + req.file.unfiltered_photo_id + ";";
      console.log("Query: " + queryText);
      result = await db.query(queryText);
      // Need to generate entry in Photos to have photo id so we can create entry in user_photo
      queryText = "INSERT INTO photos (size, creation_date, path, process_time, flag, display, height, width) VALUES (.00000001, '1970-01-01', '', 0, false, false, 0, 0) RETURNING photo_id;";
      console.log("Query: " + queryText);
      result = await db.query(queryText); 
      var photo_id = result.rows[0].photo_id;
      // We also need to create a new entry in User_Photo. Need to use generated unfiltered_photo_id
      queryText = "INSERT INTO user_photo (user_id, photo_id, filter_id, status, wait_time, unfiltered_photo_id) VALUES (" + req.query.user_id + ", " + photo_id + ", " + req.query.filter_id + ", 'waiting', 0, " + req.file.unfiltered_photo_id + ");";
      console.log("Query: " + queryText);
      db.query(queryText); 
    }
    test();
  });

  /**
   * Performs filter upload
   */
  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, config.stylePath)
    },
    filename: async function (req, file, cb) {
        // Insert new entry into the database and use the unfiltered photo ID as filename
        let queryText = "INSERT INTO filters(name, preset) VALUES('', false) RETURNING filter_id;";
        console.log("Query: " + queryText);
        var result = await db.query(queryText);
        var filter_id = result.rows[0].filter_id;
        file.filter_id = filter_id;
        var filename = 'filter' + '-' + filter_id + path.extname(file.originalname);
        cb(null, filename);
    }
  });
  app.post('/filter/upload', multer({storage: storage}).single("upload"), (req, getres) => {
    // Do verification that this is indeed a photo upload
    console.log("POST - upload");
    console.log(req.body);
    console.log(req.file);
    // getres.send(req.file);
    async function test() {
      var path = config.stylePath + "/" + req.file.filename;
      // Update record in DB to have file size and path
      let queryText = "UPDATE filters SET (name, path) = ('" + req.body.user_id + "', '" + path + "') WHERE filter_id = " + req.file.filter_id + ";";
      console.log("Query: " + queryText);
      result = await db.query(queryText);
      getres.send(""+req.file.filter_id);
      // Need to generate entry in Photos to have photo id so we can create entry in user_photo
    }
    test();
  });

  /**
   * Get all system stats
   * Takes in the request query's parameters
   */
  app.get('/system/stats', (req, getres) => {
    console.log("GET - system stats");
    let queryText = "SELECT * FROM USAGE INNER JOIN STAT_TYPES ON USAGE.stat_id = STAT_TYPES.stat_id";
    db.query(queryText)
        .then(res => {
            console.log(res.rows);
            getres.send(res.rows);
        })
        .catch(e => console.error(e.stack))
  });
};