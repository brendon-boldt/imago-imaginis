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