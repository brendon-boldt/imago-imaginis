const db = require('../db');
const multer = require('multer'); 
const path = require('path');
const jwt = require('jsonwebtoken');
var sizeOf = require('image-size');

const config = require('../../config.js');
const stat = require('./statRoutes');

const MAX_PHOTO_UPLOAD_SIZE = 7340032; // 7 MB is max photo upload size
const MAX_PHOTO_UPLOADS_FREE = 2;

/**
 * Performs JWT verification. Returns true if JWT is valid, otherwise returns error
 * Also verifies if the user is passing in their user id
 * Used for authenticated routes
 */
var verify = function(req, getres){
  var token;
  // JWT is passed either in query or in body
  if(req.query.jwt != null){
      token = req.query.jwt;
  }
  else if(req.body.jwt != null){
      token = req.body.jwt;
  }
  try{
      console.log("TOKEN:" + token);
      // console.log(token);
      var decoded = jwt.verify(token, "thisisthekey");
      var passed_user_id;
      console.log(req.query.user_id)
      console.log(req.body.user_id)
      if(req.query.user_id != undefined){
        passed_user_id = req.query.user_id;
      }
      else if(req.body.user_id != undefined){
        passed_user_id = req.body.user_id;
      }
      if(passed_user_id == null){
        getres.status(801);
        getres.statusMessage = "Missing user id";
        getres.send("Please supply your user id");
      }
      // See if passed user id matches the JWT they pass
      if(passed_user_id != undefined){
        if(passed_user_id != decoded.user_id){
          console.log("JWT user id " + decoded.user_id)
          console.log("Passed user id " + passed_user_id);
          getres.status(806);
          getres.statusMessage = "Incorrect JWT token.";
          getres.send("JWT does not match user id supplied. Please pass a valid JWT token for your user account.");
          return false;
        }
        console.log("Good")
      }
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
var verifyPaid = async function(req, getres){
  console.log("Performing JWT verification")
  var token;
  // JWT is passed either in query or in body
  if(req.query.jwt != null){
      token = req.query.jwt;
  }
  else if(req.body.jwt != null){
      token = req.body.jwt;
  }
  try{
      var decoded = jwt.verify(token, "thisisthekey");
      var passed_user_id;
      if(req.query.user_id != null){
        passed_user_id = req.query.user_id;
      }
      else if(req.body.user_id != null){
        passed_user_id = req.body.user_id;
      }
      if(passed_user_id == null){
        getres.status(801);
        getres.statusMessage = "Missing user id";
        getres.send("Please supply your user id");
        return false;
      }
      // See if passed user id matches the JWT they pass
      if(passed_user_id != null){
        if(passed_user_id != decoded.user_id){
          getres.status(806);
          getres.statusMessage = "Incorrect JWT token.";
          getres.send("JWT does not match user id supplied. Please pass a valid JWT token for your user account.");
          return false;
        }
      }
      // Return true if jwt is paid user, else return false
      // Look up user id and see if they're a paid user
      let queryText = "SELECT * FROM ASP_USERS LEFT JOIN paid_users ON asp_users.user_id = paid_users.paid_id WHERE user_ID = $1;";
      let values = [passed_user_id];
      result = await db.param_query(queryText, values)
      console.log(result.rows[0])
      if(result.rows[0].paid_id != null){
        return true;
      }
      else{
        getres.status(303);
        getres.statusMessage = "Unauthorized: Free User";
        getres.send("Please upgrade account to utilize this feature")
        return false;
      }
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
      var filename = file.fieldname + '-' + unfiltered_photo_id + path.extname(file.originalname.toLowerCase());
      cb(null, filename);
    }
  });
  app.post('/upload/photo', multer({storage: photoStorage, limits: { fileSize: MAX_PHOTO_UPLOAD_SIZE }, fileFilter: function (req, file, cb) { 
    console.log("POST - upload");
    console.log(file)
    if(!(file.mimetype == 'image/png' || file.mimetype == 'image/jpeg')){
      console.log(file.mimetype);
      req.fileValidationError = 'goes wrong on the mimetype';
      return cb(null, false, new Error('goes wrong on the mimetype'));
    }
    cb(null, true); 
  }}).single("upload"), async (req, getres) => {
    if(!verify(req, getres)){
      return;
    }
    var isPaid = await verifyPaid(req, getres);
    // If the user is a free user, check to make sure they don't have more than 2 photos
    if(!isPaid){
      let queryText = "SELECT COUNT(*) FROM user_photo WHERE user_id = $1";
      let values = [req.body.user_id];
      result = await db.param_query(queryText, values)
      console.log(result.rows[0])
      if(result.rows[0] >= MAX_PHOTO_UPLOADS_FREE){
        getres.status(605);
        getres.statusMessage = "Max uploads";
        getres.send("You have reached your max of 2 uploaded images. Please remove images before continuing.");
        return;
      }
      console.log("POST - upload");
    }
    console.log(req.file);
    if(!req.file){
      getres.status(503);
      getres.statusMessage = "No photo";
      getres.send("Please upload a photo")
    }
    if(req.fileValidationError){
      getres.status(502);
      getres.statusMessage = "Invalid file format";
      getres.send("Image must be JPG or PNG");
      return;
    }
    // TODO: Sending headers with file size checking currently not working
    if(req.fileTooBig){
      getres.status(501);
      getres.statusMessage = "File size limit exceeded! 7MB max";
      getres.send("File size limit exceeded! 7MB max");
      return;
    }
    if(req.file.size > MAX_PHOTO_UPLOAD_SIZE){
      getres.status(501);
      getres.statusMessage = "File size limit exceeded! 7MB max";
      getres.send("File size limit exceeded! 7MB max");
      return;
    }
    if(!req.body.filter_id){
      getres.status(504);
      getres.statusMessage = "No filter id";
      getres.send("Specify a filter id")
      return;
    }
    var requesterUserId = req.body.requesterUserId;
	  stat.logStatUploadPhoto(requesterUserId);
    async function upload() {
      var path = config.uploadsPath + "/" + req.file.filename;
      // Update record in DB to have file size and path
      let queryText = "UPDATE unfiltered_photo SET (size, height, width, path) = ($1, $2, $3, $4) WHERE unfiltered_photo_id = $5;";
      var values = [req.file.size, 260, 260, path, req.file.unfiltered_photo_id]
      console.log("Query: " + queryText);
      result = await db.param_query(queryText, values);
      // Need to generate entry in Photos to have photo id so we can create entry in user_photo
      queryText = "INSERT INTO photos (size, creation_date, path, process_time, flag, display, height, width) VALUES (.00000001, '1970-01-01', '', 0, false, false, 0, 0) RETURNING photo_id;";
      console.log("Query: " + queryText);
      result = await db.query(queryText); 
      var photo_id = result.rows[0].photo_id;
      // We also need to create a new entry in User_Photo. Need to use generated unfiltered_photo_id
      queryText = "INSERT INTO user_photo (user_id, photo_id, filter_id, status, wait_time, unfiltered_photo_id) VALUES ($1, $2, $3, 'waiting', 0, $4);";
      values = [req.body.user_id, photo_id, req.body.filter_id, req.file.unfiltered_photo_id]
      console.log("Query: " + queryText);
      db.param_query(queryText, values); 
      getres.send("Upload complete!");
    }
    upload();
  });

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
        var filename = file.fieldname + '-' + unfiltered_video_id + path.extname(file.originalname.toLowerCase());
        cb(null, filename);
    }
  });
  app.post('/upload/video', multer({storage: videoStorage, fileFilter: function (req, file, cb) { 
    if(!(file.mimetype == 'video/mp4')){
      console.log(file.mimetype);
      req.fileValidationError = 'goes wrong on the mimetype';
      return cb(null, false, new Error('goes wrong on the mimetype'));
    }
    cb(null, true); 
  }}).single("upload"), async (req, getres) => {
    var isPaid = await verifyPaid(req, getres);
    if(!isPaid){
      // getres.status(303);
      // getres.statusMessage = "Unauthorized: Free User";
      // getres.send("Please upgrade account to utilize this feature")
      return;
    }
    if(!req.file){
      getres.status(503);
      getres.statusMessage = "No video";
      getres.send("Please upload a video")
    }
    // File type validation check
    if(req.fileValidationError){
      res.status(502);
      res.statusMessage = "Invalid file format";
      res.send("Video must be in mp4 format");
      return;
    }
    if(!req.body.filter_id){
      getres.status(504);
      getres.statusMessage = "No filter id";
      getres.send("Specify a filter id")
      return;
    }
    console.log("POST - upload");
	var requesterUserId = req.body.requesterUserId;
	stat.logStatUploadVideo(requesterUserId);
    console.log(req.file);
    async function upload() {
      var path = config.videoUploadsPath + "/" + req.file.filename;
      // Update record in DB to have file size and path
      let queryText = "UPDATE unfiltered_video SET (size, height, width, path) = ($1, 0, 0, $2) WHERE unfiltered_video_id = $3;";
      var values = [req.file.size, path, req.file.unfiltered_video_id];
      console.log("Query: " + queryText);
      result = await db.param_query(queryText, values);
      // Need to generate entry in Videos to have photo id so we can create entry in user_photo
      // TODO: Insert height and width of video
      queryText = "INSERT INTO videos (size, creation_date, path, process_time, flag, display) VALUES (.00000001, '1970-01-01', '', 0, false, false) RETURNING video_id;";
      console.log("Query: " + queryText);
      result = await db.query(queryText); 
      var video_id = result.rows[0].video_id;
      // We also need to create a new entry in User_Video
      queryText = "INSERT INTO user_video (user_id, video_id, filter_id, status, wait_time, unfiltered_video_id) VALUES ($1, $2, $3, 'waiting', 0, $4);";
      values = [req.body.user_id, video_id, req.body.filter_id, req.file.unfiltered_video_id];
      console.log("Query: " + queryText);
      db.param_query(queryText, values); 
      getres.send("Upload complete!");
    }
    upload();
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
  app.post('/filter/upload', multer({storage: filterStorage, fileFilter: function (req, file, cb) { 
    if(!(file.mimetype == 'video/mp4')){
      console.log(file.mimetype);
      req.fileValidationError = 'goes wrong on the mimetype';
      return cb(null, false, new Error('goes wrong on the mimetype'));
    }
    cb(null, true); 
  }}).single("upload"), async (req, getres) => {
    var isPaid = await verifyPaid(req, getres);
    if(!isPaid){
      return;
    }
    // File type validation check
    if(!req.file){
      getres.status(503);
      getres.statusMessage = "No photo";
      getres.send("Please upload a photo")
    }
    if(req.fileValidationError){
      res.status(502);
      res.statusMessage = "Invalid file format";
      res.send("Video must be in mp4 format");
      return;
    }
    // Do verification that this is indeed a photo upload
    console.log("POST - upload");
	var requesterUserId = req.body.requesterUserId;
	stat.logStatUploadPhoto(requesterUserId);
    console.log(req.body);
    console.log(req.file);
    // getres.send(req.file);
    async function upload() {
      var path = config.stylePath + "/" + req.file.filename;
      // Update record in DB to have file size and path
      let queryText = "UPDATE filters SET (name, path) = ($1, $2) WHERE filter_id = $3;";
      var values = [req.body.user_id, path, req.file.filter_id];
      console.log("Query: " + queryText);
      result = await db.param_query(queryText, values);
      getres.send(""+req.file.filter_id);
      // Need to generate entry in Photos to have photo id so we can create entry in user_photo
    }
    upload();
  });

  /* Performs a profile photo upload
   * https://github.com/expressjs/multer/issues/170
   */
  var profileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, config.uploadsPath)
    },
    filename: function (req, file, cb) {
        console.log("FILENAME");
        var filename = "profile" + '-' + Date.now() + path.extname(file.originalname)
        cb(null, filename);
    }
  });
  app.post('/user/upload/profile', multer({storage: profileStorage, fileFilter: function (req, file, cb) { 
    if(!(file.mimetype == 'image/png' || file.mimetype == 'image/jpeg')){
      console.log(file.mimetype);
      req.fileValidationError = 'goes wrong on the mimetype';
      return cb(null, false, new Error('goes wrong on the mimetype'));
    }
    cb(null, true); 
  }}).single("upload"), (req, getres) => {
    if(!verify(req, getres)){
      return;
    }
    if(!req.file){
      getres.status(503);
      getres.statusMessage = "No photo";
      getres.send("Please upload a photo")
    }
    if(req.fileValidationError){
      getres.status(502);
      getres.statusMessage = "Image must be JPG or PNG";
      getres.send("Image must be JPG or PNG");
      return;
    }
    // TODO: Do verification that this is indeed a photo upload
    console.log("POST - upload");
	var requesterUserId = req.query.requesterUserId;
	stat.logStatUploadPhoto(requesterUserId);
    console.log("POST - uploaasdfasdfd");
    console.log(req.file);
    async function upload() {
      var path = config.uploadsPath + "/" + req.file.filename;
      // var path = req.file.filename;
      var queryText = "UPDATE asp_users SET (profile_photo) = ($1) WHERE user_id = $2;";
      var values = [path, req.body.user_id];
      console.log("Query: " + queryText);
      result = await db.param_query(queryText, values); 
    }
    upload();
    getres.send("Upload complete!");
  });
};