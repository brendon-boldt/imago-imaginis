/**
 * Imagino Imaginis
 * --------------------------------------------
 * These are the routes that are accessible by an administrator account
 * Only admins are allowed to access these routes
 */
const db = require('../db');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
var diskspace = require('diskspace');

const config = require('../../config.js');

/**
 * Performs JWT verification. Returns true if JWT is valid and user is a paid user, otherwise returns error
 * Used for authenticated routes that can be accessible only by a paid user.
 */
var verifyAdmin = async function(user_id) {
  let queryText = "SELECT * FROM ASP_USERS WHERE user_ID = $1;";
  let values = [user_id];
  result = await db.param_query(queryText, values)
  if (result.rows[0].admin == null || result.rows[0].admin == false) {
    getres.status(304);
    getres.statusMessage = "Unauthorized request";
    getres.send("Only admins may access this route");
    return false;
  }
  return true;
}

// Verifies if JWT is good
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

module.exports = function(app) {

  /**
   * Get all system stats
   * Takes in the request query's parameters
   */
  app.get('/system/stats', async (req, getres) => {
    // This performs the JWT authorization
    var user_id = getUserIdFromJWT(req, getres);
    if (user_id == null) {
      return; // Authorization failed
    } else {
      var isAdmin = await verifyAdmin(user_id);
      if (req.headers.bus != undefined) {
        // If the website is making the API call
        if (req.headers.bus != "Q2cxNw==") {
          getres.status(201);
          getres.statusMessage = "Unauthorized API request";
          getres.send("Unauthorized API request");
          return;
        }
      }
      // Accessing through the API
      else {
        // If they're a paid API user and trying to access API not thru website
        if (!isAdmin) {
          // If they're not an admin, return an error
          getres.status(309);
          getres.statusMessage = "Unauthorized: Regular User";
          getres.send("Only admins may access this.");
          return;
        }
      }
      let queryText = "SELECT * FROM USAGE INNER JOIN STAT_TYPES ON USAGE.stat_id = STAT_TYPES.stat_id";
      db.query(queryText)
        .then(res => {
          getres.send(res.rows);
        })
        .catch(e => console.error(e.stack))
    }
  });

  // Get all flagged photos
  app.get('/system/stats/photos/flagged', async (req, getres) => {
    // This performs the JWT authorization
    var user_id = getUserIdFromJWT(req, getres);
    if (user_id == null) {
      return; // Authorization failed
    } else {
      var isAdmin = await verifyAdmin(user_id);
      if (req.headers.bus != undefined) {
        // If the website is making the API call
        if (req.headers.bus != "Q2cxNw==") {
          getres.status(201);
          getres.statusMessage = "Unauthorized API request";
          getres.send("Unauthorized API request");
          return;
        }
      }
      // Accessing through the API
      else {
        // If they're admin API user and trying to access API not thru website
        if (!isAdmin) {
          // If they're not an admin, return an error
          getres.status(309);
          getres.statusMessage = "Unauthorized: Regular User";
          getres.send("Only admins may access this.");
          return;
        }
      }
      let queryText = "SELECT photos.photo_id, user_photo.user_id, photos.creation_date FROM photos, user_photo WHERE photos.photo_id = user_photo.photo_id AND photos.flag = true";

      db.query(queryText)
        .then(res => {
          getres.send(res.rows);
        })
        .catch(e => console.error(e.stack))
    }
  });

  // Get all flagged videos
  app.get('/system/stats/videos/flagged', async (req, getres) => {
    // This performs the JWT authorization
    var user_id = getUserIdFromJWT(req, getres);
    if (user_id == null) {
      return; // Authorization failed
    } else {
      var isAdmin = await verifyAdmin(user_id);
      if (req.headers.bus != undefined) {
        // If the website is making the API call
        if (req.headers.bus != "Q2cxNw==") {
          getres.status(201);
          getres.statusMessage = "Unauthorized API request";
          getres.send("Unauthorized API request");
          return;
        }
      }
      // Accessing through the API
      else {
        // If they're a paid API user and trying to access API not thru website
        if (!isAdmin) {
          // If they're not an admin, return an error
          getres.status(309);
          getres.statusMessage = "Unauthorized: Regular User";
          getres.send("Only admins may access this.");
          return;
        }
      }
      let queryText = "SELECT videos.video_id, user_video.user_id, videos.creation_date FROM videos, user_video WHERE videos.video_id = user_video.video_id AND videos.flag = true";

      db.query(queryText)
        .then(res => {
          getres.send(res.rows);
        })
        .catch(e => console.error(e.stack))
    }
  });

  // Get all photos being processed
  app.get('/system/stats/photos/processing', async (req, getres) => {
    // This performs the JWT authorization
    var user_id = getUserIdFromJWT(req, getres);
    if (user_id == null) {
      return; // Authorization failed
    } else {
      var isAdmin = await verifyAdmin(user_id);
      if (req.headers.bus != undefined) {
        // If the website is making the API call
        if (req.headers.bus != "Q2cxNw==") {
          getres.status(201);
          getres.statusMessage = "Unauthorized API request";
          getres.send("Unauthorized API request");
          return;
        }
      }
      // Accessing through the API
      else {
        // If they're a paid API user and trying to access API not thru website
        if (!isAdmin) {
          // If they're not an admin, return an error
          getres.status(309);
          getres.statusMessage = "Unauthorized: Regular User";
          getres.send("Only admins may access this.");
          return;
        }
      }
      let queryText = "SELECT user_photo.unfiltered_photo_ID, user_photo.filter_id, user_photo.wait_time, user_photo.user_id FROM user_photo WHERE status = 'processing'";

      db.query(queryText)
        .then(res => {
          getres.send(res.rows);
        })
        .catch(e => console.error(e.stack))
    }
  });

  // Get all videos being processed
  app.get('/system/stats/videos/processing', async (req, getres) => {
    // This performs the JWT authorization
    var user_id = getUserIdFromJWT(req, getres);
    if (user_id == null) {
      return; // Authorization failed
    } else {
      var isAdmin = await verifyAdmin(user_id);
      if (req.headers.bus != undefined) {
        // If the website is making the API call
        if (req.headers.bus != "Q2cxNw==") {
          getres.status(201);
          getres.statusMessage = "Unauthorized API request";
          getres.send("Unauthorized API request");
          return;
        }
      }
      // Accessing through the API
      else {
        // If they're a paid API user and trying to access API not thru website
        if (!isAdmin) {
          // If they're not an admin, return an error
          getres.status(309);
          getres.statusMessage = "Unauthorized: Regular User";
          getres.send("Only admins may access this.");
          return;
        }
      }
      let queryText = "SELECT user_video.unfiltered_video_ID, user_video.filter_id, user_video.wait_time, user_video.user_id FROM user_video WHERE status = 'processing'";

      db.query(queryText)
        .then(res => {
          getres.send(res.rows);
        })
        .catch(e => console.error(e.stack))
    }
  });

  // Get all uploads from past day
  app.get('/system/stats/uploads/pastday', async (req, getres) => {
    // This performs the JWT authorization
    var user_id = getUserIdFromJWT(req, getres);
    if (user_id == null) {
      return; // Authorization failed
    } else {
      var isAdmin = await verifyAdmin(user_id);
      if (req.headers.bus != undefined) {
        // If the website is making the API call
        if (req.headers.bus != "Q2cxNw==") {
          getres.status(201);
          getres.statusMessage = "Unauthorized API request";
          getres.send("Unauthorized API request");
          return;
        }
      }
      // Accessing through the API
      else {
        // If they're a paid API user and trying to access API not thru website
        if (!isAdmin) {
          // If they're not an admin, return an error
          getres.status(309);
          getres.statusMessage = "Unauthorized: Regular User";
          getres.send("Only admins may access this.");
          return;
        }
      }
      let queryText = "SELECT CAST(TIMESTAMP AS TIME), COUNT(*) FROM usage, stat_types WHERE stat_types.stat_id = usage.stat_id AND (TIMESTAMP BETWEEN now() - INTERVAL '1 day' AND now()) AND (usage.stat_id = 2 OR usage.stat_id = 3) GROUP BY cast(TIMESTAMP AS TIME) ORDER BY timestamp";
      db.query(queryText)
        .then(res => {
          getres.send(res.rows);
        })
        .catch(e => console.error(e.stack))
    }
  });

  // Get all uploads from past week
  app.get('/system/stats/uploads/pastweek', async (req, getres) => {
    // This performs the JWT authorization
    var user_id = getUserIdFromJWT(req, getres);
    if (user_id == null) {
      return; // Authorization failed
    } else {
      var isAdmin = await verifyAdmin(user_id);
      if (req.headers.bus != undefined) {
        // If the website is making the API call
        if (req.headers.bus != "Q2cxNw==") {
          getres.status(201);
          getres.statusMessage = "Unauthorized API request";
          getres.send("Unauthorized API request");
          return;
        }
      }
      // Accessing through the API
      else {
        // If they're a paid API user and trying to access API not thru website
        if (!isAdmin) {
          // If they're not an admin, return an error
          getres.status(309);
          getres.statusMessage = "Unauthorized: Regular User";
          getres.send("Only admins may access this.");
          return;
        }
      }
      let queryText = "SELECT CAST(TIMESTAMP AS DATE), COUNT(*) FROM usage, stat_types WHERE stat_types.stat_id = usage.stat_id AND (TIMESTAMP BETWEEN now() - INTERVAL '7 days' AND now()) AND (usage.stat_id = 2 OR usage.stat_id = 3) GROUP BY cast(TIMESTAMP AS DATE) ORDER BY timestamp";
      db.query(queryText)
        .then(res => {
          getres.send(res.rows);
        })
        .catch(e => console.error(e.stack))
    }
  });

  // Get all uploads from past month
  app.get('/system/stats/uploads/pastmonth', async (req, getres) => {
    // This performs the JWT authorization
    var user_id = getUserIdFromJWT(req, getres);
    if (user_id == null) {
      return; // Authorization failed
    } else {
      var isAdmin = await verifyAdmin(user_id);
      if (req.headers.bus != undefined) {
        // If the website is making the API call
        if (req.headers.bus != "Q2cxNw==") {
          getres.status(201);
          getres.statusMessage = "Unauthorized API request";
          getres.send("Unauthorized API request");
          return;
        }
      }
      // Accessing through the API
      else {
        // If they're a paid API user and trying to access API not thru website
        if (!isAdmin) {
          // If they're not an admin, return an error
          getres.status(309);
          getres.statusMessage = "Unauthorized: Regular User";
          getres.send("Only admins may access this.");
          return;
        }
      }
      // let queryText = "SELECT photos.photo_id, user_photo.user_id, photos.creation_date FROM photos, user_photo WHERE photos.photo_id = user_photo.photo_id AND photos.creation_date BETWEEN LOCALTIMESTAMP - INTERVAL '1 month' AND LOCALTIMESTAMP";
      // let queryText = "SELECT COUNT(*) FROM usage, stat_types WHERE stat_types.stat_id = usage.stat_id AND TIMESTAMP BETWEEN now() - INTERVAL '1 month' AND now()";
      let queryText = "SELECT CAST(TIMESTAMP AS DATE), COUNT(*) FROM usage, stat_types WHERE stat_types.stat_id = usage.stat_id AND (TIMESTAMP BETWEEN now() - INTERVAL '1 month' AND now()) AND (usage.stat_id = 2 OR usage.stat_id = 3) GROUP BY cast(TIMESTAMP AS DATE) ORDER BY timestamp";
      db.query(queryText)
        .then(res => {
          getres.send(res.rows);
        })
        .catch(e => console.error(e.stack))
    }
  });

  // Get all reqs from past day
  app.get('/system/stats/reqs/pastday', async (req, getres) => {
    // This performs the JWT authorization
    var user_id = getUserIdFromJWT(req, getres);
    if (user_id == null) {
      return; // Authorization failed
    } else {
      var isAdmin = await verifyAdmin(user_id);
      if (req.headers.bus != undefined) {
        // If the website is making the API call
        if (req.headers.bus != "Q2cxNw==") {
          getres.status(201);
          getres.statusMessage = "Unauthorized API request";
          getres.send("Unauthorized API request");
          return;
        }
      }
      // Accessing through the API
      else {
        // If they're a paid API user and trying to access API not thru website
        if (!isAdmin) {
          // If they're not an admin, return an error
          getres.status(309);
          getres.statusMessage = "Unauthorized: Regular User";
          getres.send("Only admins may access this.");
          return;
        }
      }
      let queryText = "SELECT CAST(TIMESTAMP AS TIME), COUNT(*) FROM usage, stat_types WHERE stat_types.stat_id = usage.stat_id AND (TIMESTAMP BETWEEN now() - INTERVAL '1 day' AND now()) AND (usage.stat_id = 0 OR usage.stat_id = 1) GROUP BY cast(TIMESTAMP AS TIME) ORDER BY timestamp";
      db.query(queryText)
        .then(res => {
          getres.send(res.rows);
        })
        .catch(e => console.error(e.stack))
    }
  });

  // Get all reqs from past week
  app.get('/system/stats/reqs/pastweek', async (req, getres) => {
    // This performs the JWT authorization
    var user_id = getUserIdFromJWT(req, getres);
    if (user_id == null) {
      return; // Authorization failed
    } else {
      var isAdmin = await verifyAdmin(user_id);
      if (req.headers.bus != undefined) {
        // If the website is making the API call
        if (req.headers.bus != "Q2cxNw==") {
          getres.status(201);
          getres.statusMessage = "Unauthorized API request";
          getres.send("Unauthorized API request");
          return;
        }
      }
      // Accessing through the API
      else {
        // If they're a paid API user and trying to access API not thru website
        if (!isAdmin) {
          // If they're not an admin, return an error
          getres.status(309);
          getres.statusMessage = "Unauthorized: Regular User";
          getres.send("Only admins may access this.");
          return;
        }
      }
      let queryText = "SELECT CAST(TIMESTAMP AS DATE), COUNT(*) FROM usage, stat_types WHERE stat_types.stat_id = usage.stat_id AND (TIMESTAMP BETWEEN now() - INTERVAL '7 days' AND now()) AND (usage.stat_id = 0 OR usage.stat_id = 1) GROUP BY cast(TIMESTAMP AS DATE) ORDER BY timestamp";
      db.query(queryText)
        .then(res => {
          getres.send(res.rows);
        })
        .catch(e => console.error(e.stack))
    }
  });

  // Get all reqs from past month
  app.get('/system/stats/reqs/pastmonth', async (req, getres) => {
    // This performs the JWT authorization
    var user_id = getUserIdFromJWT(req, getres);
    if (user_id == null) {
      return; // Authorization failed
    } else {
      var isAdmin = await verifyAdmin(user_id);
      if (req.headers.bus != undefined) {
        // If the website is making the API call
        if (req.headers.bus != "Q2cxNw==") {
          getres.status(201);
          getres.statusMessage = "Unauthorized API request";
          getres.send("Unauthorized API request");
          return;
        }
      }
      // Accessing through the API
      else {
        // If they're a paid API user and trying to access API not thru website
        if (!isAdmin) {
          // If they're not an admin, return an error
          getres.status(309);
          getres.statusMessage = "Unauthorized: Regular User";
          getres.send("Only admins may access this.");
          return;
        }
      }
      let queryText = "SELECT CAST(TIMESTAMP AS DATE), COUNT(*) FROM usage, stat_types WHERE stat_types.stat_id = usage.stat_id AND (TIMESTAMP BETWEEN now() - INTERVAL '1 month' AND now()) AND (usage.stat_id = 0 OR usage.stat_id = 1) GROUP BY cast(TIMESTAMP AS DATE) ORDER BY timestamp";
      db.query(queryText)
        .then(res => {
          getres.send(res.rows);
        })
        .catch(e => console.error(e.stack))
    }
  });

  // Get space used by DB
  app.get('/system/stats/db/spaceused', async (req, getres) => {
    // This performs the JWT authorization
    var user_id = getUserIdFromJWT(req, getres);
    if (user_id == null) {
      return; // Authorization failed
    } else {
      var isAdmin = await verifyAdmin(user_id);
      if (req.headers.bus != undefined) {
        // If the website is making the API call
        if (req.headers.bus != "Q2cxNw==") {
          getres.status(201);
          getres.statusMessage = "Unauthorized API request";
          getres.send("Unauthorized API request");
          return;
        }
      }
      // Accessing through the API
      else {
        // If they're a paid API user and trying to access API not thru website
        if (!isAdmin) {
          // If they're not an admin, return an error
          getres.status(309);
          getres.statusMessage = "Unauthorized: Regular User";
          getres.send("Only admins may access this.");
          return;
        }
      }
      let queryText = "select pg_size_pretty(pg_database_size('aspdb'))";

      db.query(queryText)
        .then(res => {
          getres.send(res.rows);
        })
        .catch(e => console.error(e.stack))
    }
  });

  // Get diskspace used by linux filesystem: free, used, and total (as well as health status)
  app.get('/system/stats/filesystem/spaceused', async (req, getres) => {
    // This performs the JWT authorization
    var user_id = getUserIdFromJWT(req, getres);
    if (user_id == null) {
      return; // Authorization failed
    } else {
      var isAdmin = await verifyAdmin(user_id);
      if (req.headers.bus != undefined) {
        // If the website is making the API call
        if (req.headers.bus != "Q2cxNw==") {
          getres.status(201);
          getres.statusMessage = "Unauthorized API request";
          getres.send("Unauthorized API request");
          return;
        }
      }
      // Accessing through the API
      else {
        // If they're a paid API user and trying to access API not thru website
        if (!isAdmin) {
          // If they're not an admin, return an error
          getres.status(309);
          getres.statusMessage = "Unauthorized: Regular User";
          getres.send("Only admins may access this.");
          return;
        }
      }
      diskspace.check('/', function(err, result) {
        getres.send(result);
      });
    }
  });

}