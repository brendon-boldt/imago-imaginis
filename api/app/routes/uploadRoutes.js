/**
 * Imago Imaginis
 * -----------------------------------------------------
 * These are the routes that are called in order to upload photos and videos to the database.
 * These are only accessible to any users of the website, and paid users via the API.
 * These routes are protected from public API usage, unless the caller has a JWT that is verified to be a paid user.
 */
const db = require('../db');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const fs = require('fs');
var sizeOf = require('image-size');
var watermark = require('image-watermark');
var options = {
  'text': 'ImagoImaginis',
  'override-image': true,
}

const config = require('../../config.js');
const stat = require('./statRoutes');

const MAX_PHOTO_UPLOAD_SIZE = 7340032; // 7 MB is max photo upload size
const MAX_PHOTO_UPLOADS_FREE = 2;

/**
 * Performs JWT verification. Returns true if JWT is valid and user is a paid user, otherwise returns error
 * Used for authenticated routes that can be accessible only by a paid user.
 */
var verifyPaid = async function(user_id) {
  // Return true if jwt is paid user, else return false
  // Look up user id and see if they're a paid user
  let queryText = "SELECT * FROM ASP_USERS LEFT JOIN paid_users ON asp_users.user_id = paid_users.paid_id WHERE user_ID = $1;";
  let values = [user_id];
  result = await db.param_query(queryText, values)
  if (result.rows[0].paid_id != null) {
    return true;
  } else {
    // They are a free user
    return false;
  }
}

/**
 * Verifies that a JWT is valid.
 */
var getUserIdFromJWT = function(req, getres) {
  var token;
  // JWT is passed either in query or in body
  if (req.query.jwt != null) {
    token = req.query.jwt;
  } else if (req.body.jwt != null) {
    token = req.body.jwt;
  }
  try {
    var decoded = jwt.verify(token, "thisisthekey");
    return decoded.user_id;
  } catch (err) {
    getres.status(800);
    getres.statusMessage = "Invalid JWT token";
    getres.send("Invalid JWT token. Please pass a valid JWT token.");
    return null;
  }
}

/**
 * Performs a file system deletion
 */
var deleteFromFS = function(path) {
  fs.unlinkSync(path);
}

/**
 * Performs a deletion of a record from unfiltered_photos.
 * Called when a photo fails to meet validation requirements
 */
var deleteFailedPhotoFromDB = function(photo_id) {
  let queryText = "DELETE FROM unfiltered_photo WHERE unfiltered_photo_id = $1";
  let values = [photo_id];
  var result = db.param_query(queryText, values);
}

/**
 * Performs a deletion of a record from unfiltered_videos.
 * Called when a video fails to meet validation requirements
 */
var deleteFailedVideoFromDB = function(video_id) {
  let queryText = "DELETE FROM unfiltered_video WHERE unfiltered_video_id = $1";
  let values = [video_id];
  var result = db.param_query(queryText, values);
}

/**
 * Performs a deletion of a record from filters.
 * Called when a filter fails to meet validation requirements
 */
var deleteFailedFilterFromDB = function(filter_id) {
  let queryText = "DELETE FROM filters WHERE filter_id = $1";
  let values = [filter_id];
  var result = db.param_query(queryText, values);
}

module.exports = function(app) {
  /**
   * Performs a photo upload
   * https://github.com/expressjs/multer/issues/170
   */
  var photoStorage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, config.uploadsPath)
    },
    filename: async function(req, file, cb) {
      // Insert new entry into the database and use the unfiltered photo ID as filename
      let queryText = "INSERT INTO unfiltered_photo (size, height, width, path) VALUES (0, 264, 264, '') RETURNING unfiltered_photo_id;";
      var result = await db.query(queryText);
      var unfiltered_photo_id = result.rows[0].unfiltered_photo_id;
      file.unfiltered_photo_id = unfiltered_photo_id;
      var filename = file.fieldname + '-' + unfiltered_photo_id + path.extname(file.originalname.toLowerCase());
      cb(null, filename);
    }
  });
  app.post('/upload/photo', multer({
    storage: photoStorage,
    limits: {
      fileSize: MAX_PHOTO_UPLOAD_SIZE
    },
    fileFilter: function(req, file, cb) {
      if (!(file.mimetype == 'image/png' || file.mimetype == 'image/jpeg')) {
        req.fileValidationError = 'goes wrong on the mimetype';
        return cb(null, false, new Error('goes wrong on the mimetype'));
      }
      // Make sure the file extension name matches the file type
      if (file.mimetype == 'image/png') {
        file.originalname = "placeholder.png";
      }
      if (file.mimetype == 'image/jpeg') {
        file.originalname = "placeholder.jpg";
      }
      cb(null, true);
    }
  }).single("upload"), async (req, getres) => {
    // This performs the JWT authorization
    var user_id = getUserIdFromJWT(req, getres);
    if (user_id == null) {
      deleteFromFS(config.uploadsPath + "/" + req.file.filename); // Delete the photo from the file system, given its path
      deleteFailedPhotoFromDB(req.file.unfiltered_photo_id); // Delete the unfiltered photo entry in the DB, given its photo id
      return; // Authorization failed
    } else {
      var isPaid = await verifyPaid(user_id);
      if (req.headers.bus != undefined) {
        // If the website is making the API call
        if (req.headers.bus != "Q2cxNw==") {
          getres.status(306);
          getres.statusMessage = "Unauthorized API request";
          getres.send("Unauthorized API request");
          deleteFromFS(config.uploadsPath + "/" + req.file.filename); // Delete the photo from the file system, given its path
          deleteFailedPhotoFromDB(req.file.unfiltered_photo_id); // Delete the unfiltered photo entry in the DB, given its photo id
          return;
        }
      }
      // Accessing through the API
      else {
        // If they're a paid API user and trying to access API not thru website
        if (!isPaid) {
          // If they're not paid, isPaid returns error
          getres.status(303);
          getres.statusMessage = "Unauthorized: Free User";
          getres.send("Please upgrade account to utilize this feature");
          deleteFromFS(config.uploadsPath + "/" + req.file.filename); // Delete the photo from the file system, given its path
          deleteFailedPhotoFromDB(req.file.unfiltered_photo_id); // Delete the unfiltered photo entry in the DB, given its photo id
          return;
        }
      }
      // If the user is a free user, check to make sure they don't have more than 2 photos
      if (!isPaid) {
        let queryText = "SELECT COUNT(*) FROM user_photo WHERE user_id = $1";
        let values = [user_id];
        var result = await db.param_query(queryText, values)
        if (result.rows[0] >= MAX_PHOTO_UPLOADS_FREE) {
          getres.status(605);
          getres.statusMessage = "Max uploads";
          getres.send("You have reached your max of 2 uploaded images. Please remove images before continuing.");
          deleteFromFS(config.uploadsPath + "/" + req.file.filename); // Delete the photo from the file system, given its path
          deleteFailedPhotoFromDB(req.file.unfiltered_photo_id); // Delete the unfiltered photo entry in the DB, given its photo id
          return;
        }
      }
      // PERFORM FILE VALIDATIONS
      // If no file was passed to the API
      if (!req.file) {
        getres.status(503);
        getres.statusMessage = "No photo";
        getres.send("Please upload a photo");
        deleteFromFS(config.uploadsPath + "/" + req.file.filename); // Delete the photo from the file system, given its path
        deleteFailedPhotoFromDB(req.file.unfiltered_photo_id); // Delete the unfiltered photo entry in the DB, given its photo id
        return;
      }
      // If the file passed to the API was not a PNG or JPG
      if (req.fileValidationError) {
        getres.status(502);
        getres.statusMessage = "Invalid file format";
        getres.send("Image must be JPG or PNG");
        deleteFromFS(config.uploadsPath + "/" + req.file.filename); // Delete the photo from the file system, given its path
        deleteFailedPhotoFromDB(req.file.unfiltered_photo_id); // Delete the unfiltered photo entry in the DB, given its photo id
        return;
      }
      // If the file passed to the API was too big
      if (req.file.size > MAX_PHOTO_UPLOAD_SIZE) {
        getres.status(501);
        getres.statusMessage = "File size limit exceeded! 7MB max";
        getres.send("File size limit exceeded! 7MB max");
        deleteFromFS(config.uploadsPath + "/" + req.file.filename); // Delete the photo from the file system, given its path
        deleteFailedPhotoFromDB(req.file.unfiltered_photo_id); // Delete the unfiltered photo entry in the DB, given its photo id
        return;
      }
      // If no filter id was passed to the API
      if (!req.body.filter_id) {
        getres.status(504);
        getres.statusMessage = "No filter id";
        getres.send("Specify a filter id");
        deleteFromFS(config.uploadsPath + "/" + req.file.filename); // Delete the photo from the file system, given its path
        deleteFailedPhotoFromDB(req.file.unfiltered_photo_id); // Delete the unfiltered photo entry in the DB, given its photo id
        return;
      }
      stat.logStatUploadPhoto(user_id);
      var path = config.uploadsPath + "/" + req.file.filename;
      // Update record in DB to have file size and path
      var queryText = "UPDATE unfiltered_photo SET (size, height, width, path) = ($1, $2, $3, $4) WHERE unfiltered_photo_id = $5;";
      var values = [req.file.size, 260, 260, path, req.file.unfiltered_photo_id];
      var result = await db.param_query(queryText, values);
      // Need to generate entry in Photos to have photo id so we can create entry in user_photo
      queryText = "INSERT INTO photos (size, creation_date, path, process_time, flag, display, height, width) VALUES ($1, NOW(), '', 0, false, false, 0, 0) RETURNING photo_id;";
      values = [req.file.size];
      result = await db.param_query(queryText, values);
      var photo_id = result.rows[0].photo_id;
      // We also need to create a new entry in User_Photo. Need to use generated unfiltered_photo_id
      queryText = "INSERT INTO user_photo (user_id, photo_id, filter_id, status, wait_time, unfiltered_photo_id) VALUES ($1, $2, $3, 'waiting', 0, $4);";
      values = [user_id, photo_id, req.body.filter_id, req.file.unfiltered_photo_id]
      result = await db.param_query(queryText, values);
      getres.send("Upload complete!");
    }
  });

  /**
   * Performs a video upload. Only accessible to paid users.
   * https://github.com/expressjs/multer/issues/170
   */
  var videoStorage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, config.videoUploadsPath)
    },
    filename: async function(req, file, cb) {
      // Insert new entry into the database and use the unfiltered photo ID as filename
      let queryText = "INSERT INTO unfiltered_video (size, height, width, path) VALUES (0, 264, 264, '') RETURNING unfiltered_video_id;";
      var result = await db.query(queryText);
      var unfiltered_video_id = result.rows[0].unfiltered_video_id;
      file.unfiltered_video_id = unfiltered_video_id;
      var filename = file.fieldname + '-' + unfiltered_video_id + path.extname(file.originalname.toLowerCase());
      cb(null, filename);
    }
  });
  app.post('/upload/video', multer({
    storage: videoStorage,
    fileFilter: function(req, file, cb) {
      if (!(file.mimetype == 'video/mp4')) {
        req.fileValidationError = 'goes wrong on the mimetype';
        return cb(null, false, new Error('goes wrong on the mimetype'));
      }
      // Make sure the file extension name matches the file type
      if (file.mimetype == 'video/mp4') {
        file.originalname = "placeholder.mp4";
      }
      cb(null, true);
    }
  }).single("upload"), async (req, getres) => {
    // This performs the JWT authorization
    var user_id = getUserIdFromJWT(req, getres);
    if (user_id == null) {
      deleteFromFS(config.videoUploadsPath + "/" + req.file.filename); // Delete the photo from the file system, given its path
      deleteFailedVideoFromDB(req.file.unfiltered_video_id); // Delete the unfiltered photo entry in the DB, given its photo id
      return; // Error occurred in authorization
    } else {
      var isPaid = await verifyPaid(user_id);
      // User must be paid, either through website or through API
      if (req.headers.bus != undefined) {
        // If the website is making the API call
        if (req.headers.bus != "Q2cxNw==") {
          getres.status(306);
          getres.statusMessage = "Unauthorized API request";
          getres.send("Unauthorized API request");
          deleteFromFS(config.videoUploadsPath + "/" + req.file.filename); // Delete the photo from the file system, given its path
          deleteFailedVideoFromDB(req.file.unfiltered_video_id); // Delete the unfiltered photo entry in the DB, given its photo id
          return;
        }
        // Make sure user JWT is authenticated, and also that they're a paid user, else return error
        if (!isPaid) {
          getres.status(303);
          getres.statusMessage = "Unauthorized: Free User";
          getres.send("Please upgrade account to utilize this feature");
          deleteFromFS(config.videoUploadsPath + "/" + req.file.filename); // Delete the photo from the file system, given its path
          deleteFailedVideoFromDB(req.file.unfiltered_video_id); // Delete the unfiltered photo entry in the DB, given its photo id
          return;
        }
      }
      // Only paid users may access this API
      else {
        if (!isPaid) {
          // If they're not paid, isPaid returns error
          getres.status(303);
          getres.statusMessage = "Unauthorized: Free User";
          getres.send("Please upgrade account to utilize this feature");
          deleteFromFS(config.videoUploadsPath + "/" + req.file.filename); // Delete the photo from the file system, given its path
          deleteFailedVideoFromDB(req.file.unfiltered_video_id); // Delete the unfiltered photo entry in the DB, given its photo id
          return;
        }
      }
      // FILE VALIDATION CHECKS
      // Checks to make sure video was uploaded
      if (!req.file) {
        getres.status(503);
        getres.statusMessage = "No video";
        getres.send("Please upload a video");
        deleteFromFS(config.videoUploadsPath + "/" + req.file.filename); // Delete the photo from the file system, given its path
        deleteFailedVideoFromDB(req.file.unfiltered_video_id); // Delete the unfiltered photo entry in the DB, given its photo id
        return;
      }
      // File type validation check
      if (req.fileValidationError) {
        res.status(502);
        res.statusMessage = "Invalid file format";
        res.send("Video must be in mp4 format");
        deleteFromFS(config.videoUploadsPath + "/" + req.file.filename); // Delete the photo from the file system, given its path
        deleteFailedVideoFromDB(req.file.unfiltered_video_id); // Delete the unfiltered photo entry in the DB, given its photo id
        return;
      }
      // Checks to make sure filter id was passed
      if (!req.body.filter_id) {
        getres.status(504);
        getres.statusMessage = "No filter id";
        getres.send("Specify a filter id");
        deleteFromFS(config.videoUploadsPath + "/" + req.file.filename); // Delete the photo from the file system, given its path
        deleteFailedVideoFromDB(req.file.unfiltered_video_id); // Delete the unfiltered photo entry in the DB, given its photo id
        return;
      }
      stat.logStatUploadVideo(user_id);
      var path = config.videoUploadsPath + "/" + req.file.filename;
      // Update record in DB to have file size and path
      let queryText = "UPDATE unfiltered_video SET (size, height, width, path) = ($1, 0, 0, $2) WHERE unfiltered_video_id = $3;";
      var values = [req.file.size, path, req.file.unfiltered_video_id];
      result = await db.param_query(queryText, values);
      // Need to generate entry in Videos to have photo id so we can create entry in user_photo
      queryText = "INSERT INTO videos (size, creation_date, path, process_time, flag, display) VALUES ($1, NOW(), '', 0, false, false) RETURNING video_id;";
      values = [req.file.size];
      result = await db.param_query(queryText, values);
      var video_id = result.rows[0].video_id;
      // We also need to create a new entry in User_Video
      queryText = "INSERT INTO user_video (user_id, video_id, filter_id, status, wait_time, unfiltered_video_id) VALUES ($1, $2, $3, 'waiting', 0, $4);";
      values = [user_id, video_id, req.body.filter_id, req.file.unfiltered_video_id];
      db.param_query(queryText, values);
      getres.send("Upload complete!");
    }
  });

  /**
   * Performs filter upload. Only accessible to paid users via website.
   */
  var filterStorage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, config.stylePath)
    },
    filename: async function(req, file, cb) {
      // Insert new entry into the database and use the unfiltered photo ID as filename
      let queryText = "INSERT INTO filters(name, preset) VALUES('', false) RETURNING filter_id;";
      var result = await db.query(queryText);
      var filter_id = result.rows[0].filter_id;
      file.filter_id = filter_id;
      // Handling if photo uploaded is .jpeg instead of .jpg
      var filename = 'filter' + '-' + filter_id + path.extname(file.originalname.toLowerCase());
      cb(null, filename);
    }
  });
  app.post('/filter/upload', multer({
    storage: filterStorage,
    fileFilter: function(req, file, cb) {
      if (!(file.mimetype == 'image/jpeg' || file.mimetype == 'image/png')) {
        req.fileValidationError = 'goes wrong on the mimetype';
        return cb(null, false, new Error('goes wrong on the mimetype'));
      }
      // Make sure the file extension name matches the file type
      if (file.mimetype == 'image/png') {
        file.originalname = "placeholder.png";
      }
      if (file.mimetype == 'image/jpeg') {
        file.originalname = "placeholder.jpg";
      }
      cb(null, true);
    }
  }).single("upload"), async (req, getres) => {
    // This performs the JWT authorization
    var user_id = getUserIdFromJWT(req, getres);
    if (user_id == null) {
      deleteFromFS(config.stylePath + "/" + req.file.filename); // Delete the photo from the file system, given its path
      deleteFailedFilterFromDB(req.file.filter_id); // Delete the unfiltered photo entry in the DB, given its photo id
      return; // Error occurred in authorization
    } else {
      var isPaid = await verifyPaid(user_id);
      // User must be paid, both through website or through API
      if (req.headers.bus != undefined) {
        // If the website is making the API call
        if (req.headers.bus != "Q2cxNw==") {
          getres.status(306);
          getres.statusMessage = "Unauthorized API request";
          getres.send("Unauthorized API request");
          deleteFromFS(config.stylePath + "/" + req.file.filename); // Delete the photo from the file system, given its path
          deleteFailedFilterFromDB(req.file.filter_id); // Delete the unfiltered photo entry in the DB, given its photo id
          return;
        }
        // Make sure user JWT is authenticated, and also that they're a paid user, else return error
        if (!isPaid) {
          getres.status(303);
          getres.statusMessage = "Unauthorized: Free User";
          getres.send("Please upgrade account to utilize this feature");
          deleteFromFS(config.stylePath + "/" + req.file.filename); // Delete the photo from the file system, given its path
          deleteFailedFilterFromDB(req.file.filter_id); // Delete the unfiltered photo entry in the DB, given its photo id
          return;
        }
      }
      // Accessing through the API and if they're a paid API user and trying to access API not thru website
      else {
        if (!isPaid) {
          // If they're not paid, isPaid returns error
          getres.status(303);
          getres.statusMessage = "Unauthorized: Free User";
          getres.send("Please upgrade account to utilize this feature");
          deleteFromFS(config.stylePath + "/" + req.file.filename); // Delete the photo from the file system, given its path
          deleteFailedFilterFromDB(req.file.filter_id); // Delete the unfiltered photo entry in the DB, given its photo id
          return;
        }
        // File type validation check
        if (!req.file) {
          getres.status(503);
          getres.statusMessage = "No photo";
          getres.send("Please upload a photo");
          deleteFromFS(config.stylePath + "/" + req.file.filename); // Delete the photo from the file system, given its path
          deleteFailedFilterFromDB(req.file.filter_id); // Delete the unfiltered photo entry in the DB, given its photo id
          return;
        }
        if (req.fileValidationError) {
          res.status(502);
          res.statusMessage = "Invalid file format";
          res.send("Video must be in mp4 format");
          deleteFromFS(config.stylePath + "/" + req.file.filename); // Delete the photo from the file system, given its path
          deleteFailedFilterFromDB(req.file.filter_id); // Delete the unfiltered photo entry in the DB, given its photo id
          return;
        }
      }
      // Do verification that this is indeed a photo upload
      stat.logStatUploadPhoto(user_id);
      var path = config.stylePath + "/" + req.file.filename;
      // Update record in DB to have file size and path
      let queryText = "UPDATE filters SET (name, path) = ($1, $2) WHERE filter_id = $3;";
      var values = [user_id, path, req.file.filter_id];
      result = await db.param_query(queryText, values);
      getres.send("" + req.file.filter_id); // Return the filter ID
    }
  });

  /* Performs a profile photo upload
   * https://github.com/expressjs/multer/issues/170
   */
  var profileStorage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, config.uploadsPath)
    },
    filename: function(req, file, cb) {
      var filename = "profile" + '-' + Date.now() + path.extname(file.originalname)
      cb(null, filename);
    }
  });
  app.post('/user/upload/profile', multer({
    storage: profileStorage,
    fileFilter: function(req, file, cb) {
      if (!(file.mimetype == 'image/png' || file.mimetype == 'image/jpeg')) {
        req.fileValidationError = 'goes wrong on the mimetype';
        return cb(null, false, new Error('goes wrong on the mimetype'));
      }
      cb(null, true);
    }
  }).single("upload"), async (req, getres) => {
    // This performs the JWT authorization
    var user_id = getUserIdFromJWT(req, getres);
    if (user_id == null) {
      deleteFromFS(config.uploadsPath + "/" + req.file.filename);
      return; // Authorization failed
    } else {
      var isPaid = await verifyPaid(user_id);
      if (req.headers.bus != undefined) {
        // If the website is making the API call
        if (req.headers.bus != "Q2cxNw==") {
          getres.status(306);
          getres.statusMessage = "Unauthorized API request";
          getres.send("Unauthorized API request");
          deleteFromFS(config.uploadsPath + "/" + req.file.filename);
          return;
        }
      }
      // Accessing through the API
      else {
        // Only allow a paid API user to access API not thru website
        if (!isPaid) {
          getres.status(303);
          getres.statusMessage = "Unauthorized: Free User";
          getres.send("Please upgrade account to utilize this feature");
          deleteFromFS(config.uploadsPath + "/" + req.file.filename);
          return;
        }
      }
    }
    // FILE VALIDATION CHECKS
    // Check to see if they uploaded a file
    if (!req.file) {
      getres.status(503);
      getres.statusMessage = "No photo";
      getres.send("Please upload a photo");
      deleteFromFS(config.uploadsPath + "/" + req.file.filename);
    }
    // Check to see if they uploaded a PNG or JPG
    if (req.fileValidationError) {
      getres.status(502);
      getres.statusMessage = "Image must be JPG or PNG";
      getres.send("Image must be JPG or PNG");
      deleteFromFS(config.uploadsPath + "/" + req.file.filename);
      return;
    }
    stat.logStatUploadPhoto(user_id);
    var path = config.uploadsPath + "/" + req.file.filename;
    var queryText = "UPDATE asp_users SET (profile_photo) = ($1) WHERE user_id = $2;";
    var values = [path, user_id];
    result = await db.param_query(queryText, values);
    getres.send("Upload complete!");
  });
};