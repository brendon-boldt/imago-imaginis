const db = require('../db');
const multer = require('multer'); 
const path = require('path');
const jwt = require('jsonwebtoken');

const config = require('../../config.js');

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
            console.log(res.rows);
            getres.send(res.rows);
        })
        .catch(e => console.error(e.stack))
  });
  
}
