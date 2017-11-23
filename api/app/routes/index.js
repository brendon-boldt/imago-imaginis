const webRoutes = require('./webRoutes.js');
const userRoutes = require('./userRoutes.js');
const styleRoutes = require('./styleRoutes.js');
const uploadRoutes = require('./uploadRoutes.js');
const adminRoutes = require('./adminRoutes.js');

module.exports = function(app){
    webRoutes(app);
    userRoutes(app);
    styleRoutes(app);
    uploadRoutes(app);
    adminRoutes(app);
}

// module.exports = (app) => {
//     app.use('/routes', routes);
// }

const LOGIN_STAT_ID = 0;
const REQUEST_STAT_ID = 1;
const UPLOAD_PHOTO_STAT_ID = 2;
const UPLOAD_VIDEO_STAT_ID = 3;

var logStat = function(userId, statId) {
	var date = new Date(Date.now()).toLocaleDateString();	
	var queryText = "INSERT INTO Usage (user_id, timestamp, stat_id) VALUES ($1, $2, $3);";
    console.log("Logging login: " + userId);
    let values = [userId, date, statId];
	var result = await db.param_query(queryText, values);
};

var logStatLogin = function(userId) {
	logStat(userId, LOGIN_STAT_ID);
};

var logStatRequest = function(userId) {
	logStat(userId, REQUEST_STAT_ID);
};

var logStatUploadPhoto = function(userId) {
	logStat(userId, UPLOAD_PHOTO_STAT_ID);	
};

var logStatUploadVideo = function(userId) {
	logStat(userId, UPLOAD_VIDEO_STAT_ID);
};
