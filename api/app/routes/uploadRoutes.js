const db = require('../db');
const multer = require('multer'); 
const path = require('path');
const jwt = require('jsonwebtoken');

const config = require('../../config.js');

const MAX_PHOTO_UPLOAD_SIZE = 7340032; // 7 MB is max photo upload size

/**
 * Performs JWT verification. Returns true if JWT is valid, otherwise returns error
 * Used for authenticated routes
 */
var verify = function(req, getres){
  var token = req.query.jwt;
  try{
      var decoded = jwt.verify(token, "thisisthekey");
      return true;
  }
  catch(err){
      getres.status(800);
      getres.statusMessage = "Invalid JWT token. Please pass a valid JWT token.";
      getres.send("Invalid JWT token. Please pass a valid JWT token.");
      return false;
  }
}

/**
 * Performs JWT verification. Returns true if JWT is valid and user is an admin, otherwise returns error
 * Used for authenticated routes that can be accessible only by an admin
 */
var verifyAdmin = function(req, getres){
  var token = req.query.jwt;
  try{
      var decoded = jwt.verify(token, "thisisthekey");
      // TODO: return true if jwt is admin, else return false
      return true;
  }
  catch(err){
      getres.status(800);
      getres.statusMessage = "Invalid JWT token. Please pass a valid JWT token.";
      getres.send("Invalid JWT token. Please pass a valid JWT token.");
      return false;
  }
}

/**
 * Performs JWT verification. Returns true if JWT is valid and user is a paid user, otherwise returns error
 * Used for authenticated routes that can be accessible only by a paid user.
 */
var verifyPaid = function(req, getres){
  var token = req.query.jwt;
  try{
      var decoded = jwt.verify(token, "thisisthekey");
      // Return true if jwt is paid user, else return false
      return true;
  }
  catch(err){
      getres.status(800);
      getres.statusMessage = "Invalid JWT token. Please pass a valid JWT token.";
      getres.send("Invalid JWT token. Please pass a valid JWT token.");
      return false;
  }
}



module.exports = function(app) {
  /**
   * Performs a photo upload
   * https://github.com/expressjs/multer/issues/170
   */
  var photoStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, config.uploadsPath)
    },
    filename: async function (req, file, cb) {
        console.log(file);
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
  var photoUpload = multer({storage: photoStorage, limits: { fileSize: MAX_PHOTO_UPLOAD_SIZE }, fileFilter: function (req, file, cb) { 
    if(!(file.mimetype == 'image/png' || file.mimetype == 'image/jpeg')){
      console.log(file.mimetype);
      req.fileValidationError = 'goes wrong on the mimetype';
      return cb(null, false, new Error('goes wrong on the mimetype'));
    }
    cb(null, true); 
  }}).single("upload");
  // app.post('/upload/photo', photoUpload, (req, getres) => {
  app.post('/upload/photo', function (req, res) {
    if(!verify(req, getres)){
      return;
    }
    photoUpload(req, res, function(err) {
      // File type validation check
      // TODO: test this
      if(req.fileValidationError){
        res.status(502);
        res.statusMessage = "Invalid file format";
        res.send("Image must be JPG or PNG");
        return;
      }
      // File size validation check
      if(err){
        console.log(err);
        res.status(501);
        res.statusMessage = "File size limit exceeded! 7MB max";
        res.send("File size limit exceeded! 7MB max");
        return;
      }
      console.log("POST - upload");
      console.log(req.file);
      async function upload() {
        var path = config.uploadsPath + "/" + req.file.filename;
        // Update record in DB to have file size and path
        let queryText = "UPDATE unfiltered_photo SET (size, height, width, path) = (" + req.file.size + ", "+req.body.height+", "+req.body.width+", '" + path + "') WHERE unfiltered_photo_id = " + req.file.unfiltered_photo_id + ";";
        console.log("Query: " + queryText);
        result = await db.query(queryText);
        // Need to generate entry in Photos to have photo id so we can create entry in user_photo
        queryText = "INSERT INTO photos (size, creation_date, path, process_time, flag, display, height, width) VALUES (.00000001, '1970-01-01', '', 0, false, false, 0, 0) RETURNING photo_id;";
        console.log("Query: " + queryText);
        result = await db.query(queryText); 
        var photo_id = result.rows[0].photo_id;
        // We also need to create a new entry in User_Photo. Need to use generated unfiltered_photo_id
        queryText = "INSERT INTO user_photo (user_id, photo_id, filter_id, status, wait_time, unfiltered_photo_id) VALUES (" + req.body.user_id + ", " + photo_id + ", " + req.body.filter_id + ", 'waiting', 0, " + req.file.unfiltered_photo_id + ");";
        console.log("Query: " + queryText);
        db.query(queryText); 
        res.send("Upload complete!");
      }
      upload();
    })
  });
  //   photoUpload(req, getres, ( err ) => {
  //     console.log("what the fuck?");
  //     if(err){
  //       console.log("FK ME");
  //       return getres.status(501).send("File too big.");
  //     }
  //   });
  //   // Do verification that this is indeed a photo upload
  //   console.log("POST - upload");
  //   console.log(req.file);
  //   async function upload() {
  //     var path = config.uploadsPath + "/" + req.file.filename;
  //     // Update record in DB to have file size and path
  //     let queryText = "UPDATE unfiltered_photo SET (size, height, width, path) = (" + req.file.size + ", "+req.body.height+", "+req.body.width+", '" + path + "') WHERE unfiltered_photo_id = " + req.file.unfiltered_photo_id + ";";
  //     console.log("Query: " + queryText);
  //     result = await db.query(queryText);
  //     // Need to generate entry in Photos to have photo id so we can create entry in user_photo
  //     queryText = "INSERT INTO photos (size, creation_date, path, process_time, flag, display, height, width) VALUES (.00000001, '1970-01-01', '', 0, false, false, 0, 0) RETURNING photo_id;";
  //     console.log("Query: " + queryText);
  //     result = await db.query(queryText); 
  //     var photo_id = result.rows[0].photo_id;
  //     // We also need to create a new entry in User_Photo. Need to use generated unfiltered_photo_id
  //     queryText = "INSERT INTO user_photo (user_id, photo_id, filter_id, status, wait_time, unfiltered_photo_id) VALUES (" + req.body.user_id + ", " + photo_id + ", " + req.body.filter_id + ", 'waiting', 0, " + req.file.unfiltered_photo_id + ");";
  //     console.log("Query: " + queryText);
  //     db.query(queryText); 
  //     getres.send("Upload complete!");
  //   }
  //   upload();
  // });

  /**
   * Performs a video upload. Only accessible to paid users.
   * https://github.com/expressjs/multer/issues/170
   */
  var videoStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, config.videoUploadsPath)
    },
    filename: async function (req, file, cb) {
        // Insert new entry into the database and use the unfiltered photo ID as filename
        let queryText = "INSERT INTO unfiltered_video (size, height, width, path) VALUES (0, 264, 264, '') RETURNING unfiltered_video_id;";
        console.log("Query: " + queryText);
        var result = await db.query(queryText);
        var unfiltered_video_id = result.rows[0].unfiltered_video_id;
        file.unfiltered_video_id = unfiltered_video_id;
        var filename = file.fieldname + '-' + unfiltered_video_id + path.extname(file.originalname);
        cb(null, filename);
    }
  });
  var videoUpload = multer({storage: videoStorage, fileFilter: function (req, file, cb) { 
    if(!(file.mimetype == 'video/mp4')){
      console.log(file.mimetype);
      req.fileValidationError = 'goes wrong on the mimetype';
      return cb(null, false, new Error('goes wrong on the mimetype'));
    }
    cb(null, true); 
  }}).single("upload");
  app.post('/upload/video', function (req, getres) {
    if(!verifyPaid(req, getres)){
      return;
    }
    videoUpload(req, res, function(err) {
      // File type validation check
      // TODO: test this
      if(req.fileValidationError){
        res.status(502);
        res.statusMessage = "Invalid file format";
        res.send("Video must be in mp4 format");
        return;
      }
      // File size validation check
      if(err){
        console.log(err);
        res.status(503);
        res.statusMessage = "File upload error";
        res.send("Something went wrong with the upload. Try again.");
        return;
      }
      console.log("POST - upload");
      console.log(req.file);
      async function upload() {
        var path = config.videoUploadsPath + "/" + req.file.filename;
        // Update record in DB to have file size and path
        let queryText = "UPDATE unfiltered_video SET (size, height, width, path) = (" + req.file.size + ", "+"0"+", "+"0"+", '" + path + "') WHERE unfiltered_video_id = " + req.file.unfiltered_video_id + ";";
        console.log("Query: " + queryText);
        result = await db.query(queryText);
        // Need to generate entry in Videos to have photo id so we can create entry in user_photo
        // TODO: Insert height and width of video
        queryText = "INSERT INTO videos (size, creation_date, path, process_time, flag, display) VALUES (.00000001, '1970-01-01', '', 0, false, false) RETURNING video_id;";
        console.log("Query: " + queryText);
        result = await db.query(queryText); 
        var video_id = result.rows[0].video_id;
        // We also need to create a new entry in User_Video
        queryText = "INSERT INTO user_video (user_id, video_id, filter_id, status, wait_time, unfiltered_video_id) VALUES (" + req.query.user_id + ", " + video_id + ", " + req.query.filter_id + ", 'waiting', 0, " + req.file.unfiltered_video_id + ");";
        console.log("Query: " + queryText);
        db.query(queryText); 
        getres.send("Upload complete!");
      }
      upload();
    });
  });

  /**
   * Performs filter upload. Only accessible to paid users.
   */
  var filterStorage = multer.diskStorage({
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
  var filterUpload = multer({storage: filterStorage, fileFilter: function (req, file, cb) { 
    if(!(file.mimetype == 'video/mp4')){
      console.log(file.mimetype);
      req.fileValidationError = 'goes wrong on the mimetype';
      return cb(null, false, new Error('goes wrong on the mimetype'));
    }
    cb(null, true); 
  }}).single("upload");
  app.post('/filter/upload', function (req, getres) {
    if(!verifyPaid(req, getres)){
      return;
    }
    filterUpload(req, res, function(err) {
      // File type validation check
      // TODO: test this
      if(req.fileValidationError){
        res.status(502);
        res.statusMessage = "Invalid file format";
        res.send("Video must be in mp4 format");
        return;
      }
      // File size validation check
      if(err){
        console.log(err);
        res.status(503);
        res.statusMessage = "File upload error";
        res.send("Something went wrong with the upload. Try again.");
        return;
      }
    // Do verification that this is indeed a photo upload
    console.log("POST - upload");
    console.log(req.body);
    console.log(req.file);
    // getres.send(req.file);
    async function upload() {
      var path = config.stylePath + "/" + req.file.filename;
      // Update record in DB to have file size and path
      let queryText = "UPDATE filters SET (name, path) = ('" + req.body.user_id + "', '" + path + "') WHERE filter_id = " + req.file.filter_id + ";";
      console.log("Query: " + queryText);
      result = await db.query(queryText);
      getres.send(""+req.file.filter_id);
      // Need to generate entry in Photos to have photo id so we can create entry in user_photo
    }
    upload();
    });
  });

  /* Performs a profile photo upload
   * https://github.com/expressjs/multer/issues/170
   */
  var profileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, config.uploadsPath)
    },
    filename: function (req, file, cb) {
        var filename = "profile" + '-' + Date.now() + path.extname(file.originalname)
        cb(null, filename);
    }
  });
  app.post('/user/upload/profile', function (req, getres) {
    if(!verify(req, getres)){
      return;
    }
    filterUpload(req, res, function(err) {
      // TODO: Do verification that this is indeed a photo upload
      console.log("POST - upload");
      console.log(req.file);
      async function upload() {
        var path = config.uploadsPath + "/" + req.file.filename;
        // var path = req.file.filename;
        var queryText = "UPDATE asp_users SET (profile_photo) = ('" + path + "') WHERE user_id = " + req.query.user_id + ";";
        console.log("Query: " + queryText);
        result = await db.query(queryText); 
      }
      upload();
      getres.send("Upload complete!");
    });
  });
};