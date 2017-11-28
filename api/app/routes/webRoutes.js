const db = require('../db');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');

const config = require('../../config.js');

/**
 * Performs JWT verification. Returns true if JWT is valid, otherwise returns error
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
        var decoded = jwt.verify(token, "thisisthekey");
        var passed_user_id;
        if(req.query.user_id != null){
          passed_user_id = req.query.user_id;
        }
        else if(req.body.user_id != null){
          passed_user_id = req.body.user_id;
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
        let queryText = "SELECT path FROM FILTERS WHERE filter_id = $1";
        let values = [id];
        db.param_query(queryText, values)
            .then(res => {
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
        if(!verify(req, getres)){
            return;
        }
        var id = req.body.id;
        var queryText = "UPDATE PHOTOS SET flag = TRUE WHERE photo_id = $1;";
        let values = [id];
        db.param_query(queryText, values)
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
	
}