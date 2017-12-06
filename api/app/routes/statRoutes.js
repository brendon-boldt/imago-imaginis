/**
 * Imago Imaginis
 * --------------------------------------------------------
 * These functions are called upon by other routes in order to 
 * insert appropriate usage stats into the database
 */
const db = require('../db');

const LOGIN_STAT_ID = 0;
const REQUEST_STAT_ID = 1;
const UPLOAD_PHOTO_STAT_ID = 2;
const UPLOAD_VIDEO_STAT_ID = 3;

/**
 * Performs the appropriate stat insertion into the usage table provided a stat ID
 */
var logStat = async function(userId, statId) {
  var date = new Date(Date.now()).toLocaleString();
  var queryText = "INSERT INTO Usage (user_id, timestamp, stat_id) VALUES ($1, $2, $3);";
  let values = [userId, date, statId];
  var result = await db.param_query(queryText, values);
};

module.exports = {

  // Add an entry into the usage table when a login is performed
  logStatLogin: function(userId) {
    logStat(userId, LOGIN_STAT_ID);
  },

  // Add an entry into the usage table when a request is performed
  logStatRequest: function(userId) {
    logStat(userId, REQUEST_STAT_ID);
  },

  // Add an entry into the usage table when a photo upload is performed
  logStatUploadPhoto: function(userId) {
    logStat(userId, UPLOAD_PHOTO_STAT_ID);
  },

  // Add an entry into the usage table when a video upload is performed
  logStatUploadVideo: function(userId) {
    logStat(userId, UPLOAD_VIDEO_STAT_ID);
  }

};