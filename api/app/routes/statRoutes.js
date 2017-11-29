const db = require('../db');

const LOGIN_STAT_ID = 0;
const REQUEST_STAT_ID = 1;
const UPLOAD_PHOTO_STAT_ID = 2;
const UPLOAD_VIDEO_STAT_ID = 3;

var logStat = async function(userId, statId) {
    var date = new Date(Date.now()).toLocaleString();
    var queryText = "INSERT INTO Usage (user_id, timestamp, stat_id) VALUES ($1, $2, $3);";
    console.log("Logging login: " + userId);
    let values = [userId, date, statId];
    var result = await db.param_query(queryText, values);
};

module.exports = {

    logStatLogin: function(userId) {
        logStat(userId, LOGIN_STAT_ID);
    },

    logStatRequest: function(userId) {
        logStat(userId, REQUEST_STAT_ID);
    },

    logStatUploadPhoto: function(userId) {
        logStat(userId, UPLOAD_PHOTO_STAT_ID);
    },

    logStatUploadVideo: function(userId) {
        logStat(userId, UPLOAD_VIDEO_STAT_ID);
    }

};