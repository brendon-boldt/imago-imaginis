const db = require('../db');
const multer = require('multer'); 
const path = require('path');
const jwt = require('jsonwebtoken');
var diskspace = require('diskspace');

const config = require('../../config.js');

// HIDE ALL FROM PUBLIC
module.exports = function(app) {

  /**
   * Get all system stats
   * Takes in the request query's parameters
   */
  app.get('/system/stats', (req, getres) => {
    console.log("GET - system stats");
    let queryText = "SELECT * FROM USAGE INNER JOIN STAT_TYPES ON USAGE.stat_id = STAT_TYPES.stat_id";
    db.query(queryText)
        .then(res => {
            getres.send(res.rows);
        })
        .catch(e => console.error(e.stack))
  });
    
    // Get all flagged photos
app.get('/system/stats/flagged', (req, getres) => {
    console.log("GET - flagged photos");
      
    let queryText = "SELECT photos.photo_id, user_photo.user_id, photos.creation_date FROM photos, user_photo WHERE photos.photo_id = user_photo.photo_id AND photos.flag = true";
      
    db.query(queryText)
        .then(res => {
            getres.send(res.rows);
        })
        .catch(e => console.error(e.stack))
  });

    
 
// Get all photos being processed
app.get('/system/stats/photos/processing', (req, getres) => {
    console.log("GET - processing photos");
      
    let queryText = "SELECT user_photo.unfiltered_photo_ID, user_photo.filter_id, user_photo.wait_time, user_photo.user_id FROM user_photo WHERE status = 'processing'";
      
    db.query(queryText)
        .then(res => {
            getres.send(res.rows);
        })
        .catch(e => console.error(e.stack))
  });
    
    
// Get all videos being processed
app.get('/system/stats/videos/processing', (req, getres) => {
    console.log("GET - processing videos");
      
    let queryText = "SELECT user_video.unfiltered_video_ID, user_video.filter_id, user_video.wait_time, user_video.user_id FROM user_video WHERE status = 'processing'";
      
    db.query(queryText)
        .then(res => {
            getres.send(res.rows);
        })
        .catch(e => console.error(e.stack))
  });
       
    
// Get all uploads from past day
app.get('/system/stats/uploads/pastday', (req, getres) => {
    console.log("GET - uploads from past day");
      
    let queryText = "SELECT photos.photo_id, user_photo.user_id, photos.creation_date FROM photos, user_photo WHERE photos.photo_id = user_photo.photo_id AND photos.creation_date BETWEEN LOCALTIMESTAMP - INTERVAL '1 day' AND LOCALTIMESTAMP";
      
    db.query(queryText)
        .then(res => {
            getres.send(res.rows);
        })
        .catch(e => console.error(e.stack))
  });   

    
// Get all uploads from past week
app.get('/system/stats/uploads/pastweek', (req, getres) => {
    console.log("GET - uploads from past week");
      
    let queryText = "SELECT photos.photo_id, user_photo.user_id, photos.creation_date FROM photos, user_photo WHERE photos.photo_id = user_photo.photo_id AND photos.creation_date BETWEEN LOCALTIMESTAMP - INTERVAL '7 days' AND LOCALTIMESTAMP";
      
    db.query(queryText)
        .then(res => {
            getres.send(res.rows);
        })
        .catch(e => console.error(e.stack))
  });    
    

// Get all uploads from past month
app.get('/system/stats/uploads/pastmonth', (req, getres) => {
    console.log("GET - uploads from past month");
      
    let queryText = "SELECT photos.photo_id, user_photo.user_id, photos.creation_date FROM photos, user_photo WHERE photos.photo_id = user_photo.photo_id AND photos.creation_date BETWEEN LOCALTIMESTAMP - INTERVAL '1 month' AND LOCALTIMESTAMP";
      
    db.query(queryText)
        .then(res => {
            getres.send(res.rows);
        })
        .catch(e => console.error(e.stack))
  });    
  
    

//Get space used by DB
app.get('/system/stats/db/spaceused', (req, getres) => {
    console.log("GET - space used by db");
      
    let queryText = "select pg_size_pretty(pg_database_size('aspdb'))";
      
    db.query(queryText)
        .then(res => {
            getres.send(res.rows);
        })
        .catch(e => console.error(e.stack))
  });
    
// Get diskspace used by linux filesystem: free, used, and total (as well as health status)
app.get('/system/stats/filesystem/spaceused', (req, getres) => {
    console.log("GET - space used by filesystem");
      
    diskspace.check('/', function (err, result)
    {
        getres.send(result);
    });
  }); 
    

// Get diskspace used by Windows filesystem: free, used, and total (as well as health status)
//app.get('/system/stats/filesystem/spaceused', (req, getres) => {
//    console.log("GET - space used by filesystem");
//      
//    diskspace.check('C', function (err, result)
//    {
//        getres.send(result);
//    });
//  }); 
  
  
}
