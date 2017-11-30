const db = require('../db');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const validator = require('validator');

const config = require('../../config.js');
const stat = require('./statRoutes');

const PROPER_ID = 1;

const MAX_PHOTO_UPLOADS_FREE = 2;

/**
 * Performs JWT verification. Returns true if JWT is valid and user is a paid user, otherwise returns error
 * Used for authenticated routes that can be accessible only by a paid user.
 */
var verifyPaid = async function(user_id){
  let queryText = "SELECT * FROM ASP_USERS LEFT JOIN paid_users ON asp_users.user_id = paid_users.paid_id WHERE user_ID = $1;";
  let values = [user_id];
  result = await db.param_query(queryText, values)
  console.log(result.rows[0])
  if(result.rows[0].paid_id != null){
    // The user is a paid user.
    return true;
  }
  else{
    return false;
  }
}

/**
 * Takes in a JWT from the request object and verifies if it is a valid JWT.
 * Returns an error if the JWT is invalid.
 */
var getUserIdFromJWT = function(req, getres){
  console.log("EXPRESS - Performing JWT verification")
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
      return decoded.user_id;
  }
  catch(err){
    getres.status(800);
    getres.statusMessage = "Invalid JWT token";
    getres.send("Invalid JWT token. Please pass a valid JWT token.");
    return null;
  }
}

module.exports = function(app) {
    /**
     * Inserts an entry into the asp_users' table
     * Takes in the request body's parameters
     */
    app.post('/user/create', (req, getres) => {
    console.log("POST - create account");
    // Verify if it's coming from website.
    // Only the website may create users
    if(req.headers.bus != undefined){
      if(req.headers.bus != "Q2cxNw=="){
        getres.status(201);
        getres.statusMessage = "Unauthorized API request";
        getres.send("Unauthorized API request");
        return;
      }
    }
    else{
      getres.status(201);
      getres.statusMessage = "Unauthorized API request";
      getres.send("Unauthorized API request");
      return;
    }
    if(req.body.first_name == null || req.body.last_name == null || req.body.email == null || req.body.password == null){
      getres.status(406);
      getres.statusMessage = "Missing info";
      getres.send("Missing user information. Please provide all user information. Password is optional");
      return;
    }
    var firstName = req.body.first_name.trim();
    var lastName = req.body.last_name.trim();
    var email = req.body.email.trim();
    var password = req.body.password;
    if(req.body.first_name == "" || lastName == "" || email == "" || password == ""){
      getres.status(406);
      getres.statusMessage = "Missing info";
      getres.send("Missing user information. Please provide all user information. Password is optional");
      return;
    }
    if(!validator.isEmail(email)){
      console.log("Not a valid email")
      getres.status(408);
      getres.statusMessage = "Invalid email";
      getres.send("Please enter a valid email.");
      return;
    }
    const hash = crypto.createHash('sha256');
    hash.update(password);
    password = hash.digest('hex');
    var date = new Date(Date.now()).toLocaleDateString();
    // Verify email is unique
    var queryText = "SELECT * FROM ASP_USERS WHERE LOWER(email) = LOWER($1);";
    let values = [email];
    db.param_query(queryText, values)
      .then(res => {
        if (res == undefined) {
            getres.send("Create account failed");
        } else if (res.rowCount > 0) {
            console.log("Email already registered to account");
            getres.status(401);
            getres.statusMessage = "Email already registered";
            getres.send("Email already registered to an account");
        } else {
          // Email is unique
          console.log("Email is unique");
          let queryText = "INSERT INTO asp_users (first_name, last_name, email, password, date_joined, status, admin) VALUES ($1, $2, LOWER($3), $4, $5, true, false);";
          console.log("Query: " + queryText);
          let values = [firstName, lastName, email, password, date];
          db.param_query(queryText, values)
              .then(res => {
                  if (res != undefined) {
                      console.log("Account creation successful!");
                      getres.send("Account creation successful!");
                  } else {
                      getres.send("Account creation failed");
                  }
              })
              .catch(e => console.error(e.stack))
          }
      })
      .catch(e => console.error(e.stack))
    });

    /**
     * Modifies an entry in the asp_users' table
     * Takes in the request body's parameters
     */
    app.post('/user/alter', async (req, getres) => {
        console.log("POST - alter account");
        // This performs the JWT authorization
        var user_id = getUserIdFromJWT(req, getres);
        if(user_id == null){
          return; // Authorization failed
        }
        else{
          var isPaid = await verifyPaid(user_id);
          if(req.headers.bus != undefined){
            // If the website is making the API call
            if(req.headers.bus != "Q2cxNw=="){
              getres.status(201);
              getres.statusMessage = "Unauthorized API request";
              getres.send("Unauthorized API request");
              return;
            }
          }
          // Accessing through the API
          else{
            // If they're a paid API user and trying to access API not thru website
            if(!isPaid){
              // If they're not paid, isPaid returns error
              getres.status(303);
              getres.statusMessage = "Unauthorized: Free User";
              getres.send("Please upgrade account to utilize this feature")
              return;
            }
          }
          // var id = req.body.user_id;
          // Verify that they provided information to all the fields
          if(req.body.first_name == null || req.body.last_name == null || req.body.email == null){
            getres.status(406);
            getres.statusMessage = "Missing info";
            getres.send("Missing user information. Please provide all user information. Password is optional");
            return;
          }
          var firstName = req.body.first_name.trim();
          var lastName = req.body.last_name.trim();
          var email = req.body.email.trim();
          var password = req.body.password;
          if(req.body.first_name == "" || lastName == "" || email == ""){
            getres.status(406);
            getres.statusMessage = "Missing info";
            getres.send("Missing user information. Please provide all user information. Password is optional");
            return;
          }
          if(!validator.isEmail(email)){
            console.log(email)
            console.log("Not a valid email")
            getres.status(409);
            getres.statusMessage = "Invalid email";
            getres.send("Please enter a valid email.");
            return;
          }
          // Verify email is unique
          var queryText = "SELECT * FROM ASP_USERS WHERE LOWER(email) = LOWER($1) AND user_id != $2;";
          console.log(queryText);
          let values = [email, user_id];
          db.param_query(queryText, values)
            .then(res => {
                if (res == undefined) {
                    getres.send("Alter account failed");
                } else if (res.rowCount > 0) {
                    console.log("Email already registered to account");
                    getres.status(401);
                    getres.statusMessage = "Email already registered";
                    getres.send("Email already registered to account");
                } else {
                    // Email is unique
                    console.log("Email is unique");
                    // If password is empty, leave it alone
                    if (password == "" || password == null) {
                        queryText = "UPDATE asp_users SET (first_name, last_name, email) = ($1, $2, $3) WHERE user_id = $4;";
                        values = [firstName, lastName, email, user_id];
                    } else {
                        console.log(password);
                        const hash = crypto.createHash('sha256');
                        hash.update(password);
                        password = hash.digest('hex');
                        queryText = "UPDATE asp_users SET (first_name, last_name, email, password) = ($1, $2, $3, $4) WHERE user_id = $5;";
                        values = [firstName, lastName, email, password, user_id];
                    }
                    console.log("new Query: " + queryText);
                    db.param_query(queryText, values)
                        .then(res => {
                            console.log(res);
                            if (res != undefined) {
                                console.log("Account update successful!");
                                getres.send("Account update successful!");
                            } else {
                                getres.send("Account update failed");
                            }
                        })
                        .catch(e => console.error(e.stack))
                }
            })
            .catch(e => console.error(e.stack))
          }
    });

    /**
     * Takes in the request query's parameters
     * Signs a JWT token and returns it to the user
     * If the user doesn't exist, return an error
     */
    app.get('/user/login', async (req, getres) => {
        console.log("GET - login");
        var email = req.query.email;
        var password = req.query.password;
        const hash = crypto.createHash('sha256');
        hash.update(password);
        password = hash.digest('hex');
        // Verify if it's coming from website. If not, then verify that is a paid API user.
        console.log(req.headers)
        if(req.headers.bus != undefined){
          if(req.headers.bus != "Q2cxNw=="){
            getres.status(201);
            getres.statusMessage = "Unauthorized API request";
            getres.send("Unauthorized API request");
            return;
          }
        }
        else{
          // Verify if paid user using EMAIL and PASSWORD credentials
          let queryText = "SELECT * FROM ASP_USERS LEFT JOIN paid_users ON asp_users.user_id = paid_users.paid_id WHERE email = $1 AND password = $2;";
          let values = [email, password];
          result = await db.param_query(queryText, values)
          if(result.rows[0] != null){
            if(result.rows[0].paid_id == null){
              getres.status(303);
              getres.statusMessage = "Unauthorized: Free User";
              getres.send("Please upgrade account to utilize this feature")
              return false;
            }
          }
          else{
            getres.status(405);
            getres.statusMessage = "Login failed: User not found.";
            getres.send("User not found");
            return;
          }
          console.log("paid user api call test")
        }
        let queryText = "SELECT * FROM asp_users LEFT JOIN paid_users ON asp_users.user_id = paid_users.paid_id WHERE email = $1 AND password = $2;";
        console.log(queryText);
        let values = [email, password];
        db.param_query(queryText, values)
            .then(res => {
                if (res.rows[0] != null) {
					          stat.logStatLogin(res.rows[0].user_id);
                    // Puts various user information into the JWT
                    console.log(res.rows);
                    // Put the user ID in the JWT payload
                    var payload = {
                        user_id: res.rows[0].user_id,
                    };
                    var token = jwt.sign(payload, "thisisthekey", {
                        expiresIn: '1h'
                    }); // Sets the token to expire in an hour
                    var decoded = jwt.verify(token, "thisisthekey"); // For reference
                    // Return the token to the user
                    getres.statusMessage = "Login success";
                    // Send the user their token and their user id
                    getres.send({"user_id": res.rows[0].user_id, "token": token});
                    // getres.send(token);
                } else {
                    getres.status(405);
                    getres.statusMessage = "Login failed: User not found.";
                    getres.send("User not found");
                }
            })
            .catch(e => console.error(e.stack))
    });

    /**
     * Returns users that match a query string
     * Takes in the request query's parameters
     */
    app.get('/user/search', async (req, getres) => {
        console.log("GET - search");
          if(req.headers.bus != undefined){
            // If the website is making the API call
            if(req.headers.bus != "Q2cxNw=="){
              getres.status(201);
              getres.statusMessage = "Unauthorized API request";
              getres.send("Unauthorized API request");
              return;
            }
          }
          // Accessing through the API
          else{
            // This performs the JWT authorization
            var user_id = getUserIdFromJWT(req, getres);
            if(user_id == null){
              return; // Authorization failed
            }
            var isPaid = await verifyPaid(user_id);
            // If they're a paid API user and trying to access API not thru website
            if(!isPaid){
              // If they're not paid, isPaid returns error
              getres.status(303);
              getres.statusMessage = "Unauthorized: Free User";
              getres.send("Please upgrade account to utilize this feature")
              return;
            }
          }
          stat.logStatRequest(0);
          var searchString = "%" + req.query.searchString + "%";
          let queryText = "SELECT * FROM ASP_USERS WHERE LOWER(first_name::text || last_name::text) LIKE LOWER($1)";
          let values = [searchString];
          db.param_query(queryText, values)
              .then(res => {
                  getres.send(res.rows);
              })
              .catch(e => console.error(e.stack))
    });

    /**
     * Returns user info for user with id
     * Takes in the request query's parameters
     */
    app.get('/user/info', async (req, getres) => {
        console.log("GET - info $");
        if(req.headers.bus != undefined){
          // If the website is making the API call
          if(req.headers.bus != "Q2cxNw=="){
            getres.status(201);
            getres.statusMessage = "Unauthorized API request";
            getres.send("Unauthorized API request");
            return;
          }
        }
        // Accessing through the API
        else{
          // This performs the JWT authorization
          var user_id = getUserIdFromJWT(req, getres);
          if(user_id == null){
            return; // Authorization failed
          }
          var isPaid = await verifyPaid(user_id);
          // If they're a paid API user and trying to access API not thru website
          if(!isPaid){
            // If they're not paid, isPaid returns error
            getres.status(303);
            getres.statusMessage = "Unauthorized: Free User";
            getres.send("Please upgrade account to utilize this feature")
            return;
          }
        }
          stat.logStatRequest(0);
          console.log("GET - info");
          var id = req.query.user_id;
          let queryText = "SELECT * FROM ASP_USERS WHERE user_ID = $1;";
          let values = [id];
          db.param_query(queryText, values)
              .then(res => {
                  getres.send(res.rows);
              })
              .catch(e => console.error(e.stack))
    });

    /**
     * Returns user's unstyled photos for user with id
     * Takes in the request query's parameters
     */
    app.get('/user/photos/unstyled', async (req, getres) => {
        console.log("GET - user unstyled photos");
        if(req.headers.bus != undefined){
          // If the website is making the API call
          if(req.headers.bus != "Q2cxNw=="){
            getres.status(201);
            getres.statusMessage = "Unauthorized API request";
            getres.send("Unauthorized API request");
            return;
          }
        }
        // Accessing through the API
        else{
          // This performs the JWT authorization
          var user_id = getUserIdFromJWT(req, getres);
          if(user_id == null){
            return; // Authorization failed
          }
          var isPaid = await verifyPaid(user_id);
          // If they're a paid API user and trying to access API not thru website
          if(!isPaid){
            // If they're not paid, isPaid returns error
            getres.status(303);
            getres.statusMessage = "Unauthorized: Free User";
            getres.send("Please upgrade account to utilize this feature")
            return;
          }
        }
          stat.logStatRequest(0);
          var id = req.query.user_id;
          let queryText = "SELECT * FROM unfiltered_photo WHERE unfiltered_photo_id IN (SELECT unfiltered_photo_id FROM USER_PHOTO WHERE user_ID = $1 AND (status = 'waiting' OR status = 'processing')) ORDER BY unfiltered_photo_id;";
          let values = [id];
          db.param_query(queryText, values)
              .then(res => {
                  getres.send(res.rows);
              })
              .catch(e => console.error(e.stack))
    });

    /**
     * Returns user's unstyled videos for user with id
     * Takes in the request query's parameters
     */
    app.get('/user/videos/unstyled', async (req, getres) => {
        console.log("GET - user unstyled video");
        // Making sure paid API user or website is accessing the API
        // This performs the JWT authorization
        if(req.headers.bus != undefined){
          // If the website is making the API call
          if(req.headers.bus != "Q2cxNw=="){
            getres.status(201);
            getres.statusMessage = "Unauthorized API request";
            getres.send("Unauthorized API request");
            return;
          }
        }
        // Accessing through the API
        else{
          // This performs the JWT authorization
          var user_id = getUserIdFromJWT(req, getres);
          if(user_id == null){
            return; // Authorization failed
          }
          var isPaid = await verifyPaid(user_id);
          // If they're a paid API user and trying to access API not thru website
          if(!isPaid){
            // If they're not paid, isPaid returns error
            getres.status(303);
            getres.statusMessage = "Unauthorized: Free User";
            getres.send("Please upgrade account to utilize this feature")
            return;
          }
        }
        stat.logStatRequest(0);
        var id = req.query.user_id;
        let queryText = "SELECT * FROM unfiltered_video WHERE unfiltered_video_id IN (SELECT unfiltered_video_id FROM user_video WHERE user_ID = $1 AND (status = 'waiting' OR status = 'processing')) ORDER BY unfiltered_video_id;";
        let values = [id];
        db.param_query(queryText, values)
            .then(res => {
                getres.send(res.rows);
            })
            .catch(e => console.error(e.stack))
    });

    /**
     * Creates a paid user with id
     * Takes in the request body's parameters
     * TODO: How to hide from the public?
     */
    app.post('/user/paid', async (req, getres) => {
        console.log("Post - create paid user");
        // Making sure paid API user or website is accessing the API
        // This performs the JWT authorization
        var user_id = getUserIdFromJWT(req, getres);
        if(user_id == null){
          return; // Authorization failed
        }
        else{
          if(req.headers.bus != undefined){
            // If the website is making the API call
            if(req.headers.bus != "Q2cxNw=="){
              getres.status(201);
              getres.statusMessage = "Unauthorized API request";
              getres.send("Unauthorized API request");
              return;
            }
          }
          // Accessing through the API
          else{
            // Access through the API by a user should not be allowed, so return an error anyways.
            getres.status(303);
            getres.statusMessage = "Unauthorized: Free User";
            getres.send("Please upgrade account to utilize this feature")
            return;
            }
          }
        stat.logStatRequest(user_id);
        var id = req.body.user_id;
        var queryText = "SELECT * FROM Paid_Users WHERE user_id = $1;";
        let values = [id];
        db.param_query(queryText, values)
            .then(res => {
                if (res == undefined) {
                    getres.send("Paid user creation failed");
                }
                if (res.rowCount === 0) {
                    queryText = "INSERT INTO Paid_Users (user_ID) VALUES ($1);";
                    let values = [id];
                    db.param_query(queryText, values).then(res => {
                        if (res != undefined) {
                            console.log("Paid user created");
                            getres.send("Paid user created");
                        }
                    })
                } else {
                    console.log("User is already paid account");
                    getres.send("User is already paid account");
                }
            })
            .catch(e => console.error(e.stack))
    });

    /**
     * Set a photo to display or not on user profile on passed photo_id
     * Takes in the request body's parameters
     * Make sure the photo is owned by the person 
     */
    app.post('/user/photos/set-display', async (req, getres) => {
        console.log("POST - set photo to display");
        // This performs the JWT authorization
        var user_id = getUserIdFromJWT(req, getres);
        if(user_id == null){
          return; // Authorization failed
        }
        else{
          var isPaid = await verifyPaid(user_id);
          if(req.headers.bus != undefined){
            // If the website is making the API call
            if(req.headers.bus != "Q2cxNw=="){
              getres.status(201);
              getres.statusMessage = "Unauthorized API request";
              getres.send("Unauthorized API request");
              return;
            }
          }
          // Accessing through the API
          else{
            // If they're a paid API user and trying to access API not thru website
            if(!isPaid){
              // If they're not paid, isPaid returns error
              getres.status(303);
              getres.statusMessage = "Unauthorized: Free User";
              getres.send("Please upgrade account to utilize this feature")
              return;
            }
          }
          stat.logStatRequest(user_id);
          var photo_id = req.body.photo_id;
          var display = req.body.display;
          if(photo_id == null || display == null){
            getres.status(406);
            getres.statusMessage = "Missing info";
            getres.send("Missing information. Refer to API documentation for all necessary information.");
            return;
          }
          var queryText = "SELECT * FROM USER_PHOTO WHERE photo_id = $1 AND user_id = $2";
          let values = [photo_id, user_id]
          var results = await db.param_query(queryText, values);
          // If the photo does not belong to the user, return error
          if(results.rows[0] == 0){
            getres.status(408);
            getres.statusMessage = "Photo Ownership Error";
            getres.send("This photo does not belong to this account. Please try again.");
            return;
          }
          var queryText = "UPDATE PHOTOS SET display = $1 WHERE photo_id = $2;";
          values = [display, photo_id];
          console.log(queryText);
          db.param_query(queryText, values)
              .then(res => {
                  if (res != undefined) {
                      console.log("Photo profile display successful! Changed to " + req.body.display);
                      getres.send("Photo profile display successful! Changed to " + req.body.display);
                  } else {
                      getres.send("Photo profile display change failed");
                  }
              })
              .catch(e => {
                console.error(e.stack); 
                getres.status(402);
                getres.statusMessage = "Error";
                getres.send("Something went wrong. Please try again.");
              })
            }
    });

    /**
     * Set a video to display or not on user profile on passed video_id
     * Takes in the request body's parameters
     */
    app.post('/user/videos/set-display', async (req, getres) => {
        console.log("POST - set video to display");
        // This performs the JWT authorization
        var user_id = getUserIdFromJWT(req, getres);
        if(user_id == null){
          return; // Authorization failed
        }
        else{
          var isPaid = await verifyPaid(user_id);
          if(req.headers.bus != undefined){
            // If the website is making the API call
            if(req.headers.bus != "Q2cxNw=="){
              getres.status(201);
              getres.statusMessage = "Unauthorized API request";
              getres.send("Unauthorized API request");
              return;
            }
          }
          // Accessing through the API
          else{
            // If they're a paid API user and trying to access API not thru website
            if(!isPaid){
              // If they're not paid, isPaid returns error
              getres.status(303);
              getres.statusMessage = "Unauthorized: Free User";
              getres.send("Please upgrade account to utilize this feature")
              return;
            }
          }
          stat.logStatRequest(user_id);
        var video_id = req.body.video_id;
        var display = req.body.display;
        if(video_id == null || display == null){
          getres.status(406);
          getres.statusMessage = "Missing info";
          getres.send("Missing information. Refer to API documentation for all necessary information.");
          return;
        }
        var queryText = "SELECT * FROM USER_VIDEO WHERE video_id = $1 AND user_id = $2";
        let values = [video_id, user_id]
        var results = await db.param_query(queryText, values);
        // If the photo does not belong to the user, return error
        if(results.rows[0] == 0){
          getres.status(408);
          getres.statusMessage = "Video Ownership Error";
          getres.send("This video does not belong to this account. Please try again.");
          return;
        }
        var queryText = "UPDATE VIDEOS SET display = $1 WHERE video_id = $2;";
        values = [display, video_id];
        console.log(queryText);
        db.param_query(queryText, values)
            .then(res => {
                if (res != undefined) {
                    console.log("Photo profile display successful! Changed to " + req.body.display);
                    getres.send("Photo profile display successful! Changed to " + req.body.display);
                } else {
                    getres.send("Photo profile display change failed");
                }
            })
            .catch(e => console.error(e.stack))
          }
    });

    /**
     * Returns user's styled videos for user with id
     * Takes in the request query's parameters
     */
    app.get('/user/videos', async (req, getres) => {
        console.log("GET - user videos");
        if(req.headers.bus != undefined){
          // If the website is making the API call
          if(req.headers.bus != "Q2cxNw=="){
            getres.status(201);
            getres.statusMessage = "Unauthorized API request";
            getres.send("Unauthorized API request");
            return;
          }
        }
        // Accessing through the API
        else{
          // This performs the JWT authorization
          var user_id = getUserIdFromJWT(req, getres);
          if(user_id == null){
            return; // Authorization failed
          }
          var isPaid = await verifyPaid(user_id);
          // If they're a paid API user and trying to access API not thru website
          if(!isPaid){
            // If they're not paid, isPaid returns error
            getres.status(303);
            getres.statusMessage = "Unauthorized: Free User";
            getres.send("Please upgrade account to utilize this feature")
            return;
          }
        }
        stat.logStatRequest(0);
        var id = req.query.user_id;
        if(id == null){
          getres.status(406);
          getres.statusMessage = "Missing info";
          getres.send("Missing information. Refer to API documentation for all necessary information.");
          return;
        }
        let queryText = "SELECT * FROM VIDEOS WHERE video_id IN (SELECT video_id FROM USER_VIDEO WHERE user_ID = $1 AND status = 'done') ORDER BY video_id;";
        let values = [id];
        db.param_query(queryText, values)
            .then(res => {
                getres.send(res.rows);
            })
            .catch(e => console.error(e.stack))
    });

    /**
     * Returns user's styled photos for user with id
     * Takes in the request query's parameters
     */
    app.get('/user/photos', async (req, getres) => {
        console.log("GET - user photos");
        // Making sure paid user or website is accessing the API
        // This performs the JWT authorization
        if(req.headers.bus != undefined){
          // If the website is making the API call
          if(req.headers.bus != "Q2cxNw=="){
            getres.status(201);
            getres.statusMessage = "Unauthorized API request";
            getres.send("Unauthorized API request");
            return;
          }
        }
        // Accessing through the API
        else{
          // This performs the JWT authorization
          var user_id = getUserIdFromJWT(req, getres);
          if(user_id == null){
            return; // Authorization failed
          }
          var isPaid = await verifyPaid(user_id);
          // If they're a paid API user and trying to access API not thru website
          if(!isPaid){
            // If they're not paid, isPaid returns error
            getres.status(303);
            getres.statusMessage = "Unauthorized: Free User";
            getres.send("Please upgrade account to utilize this feature")
            return;
          }
        }
        stat.logStatRequest(0);
        var id = req.query.id;
        var id = req.query.user_id;
        if(id == null){
          getres.status(406);
          getres.statusMessage = "Missing info";
          getres.send("Missing information. Refer to API documentation for all necessary information.");
          return;
        }
        let queryText = "SELECT * FROM PHOTOS WHERE photo_id in (SELECT photo_id FROM USER_PHOTO WHERE user_ID = $1 AND status = 'done') ORDER BY photo_id";
        let values = [id];
        db.param_query(queryText, values)
            .then(res => {
                getres.send(res.rows);
            })
            .catch(e => console.error(e.stack))
    });

    /**
     * Deletes the photo id passed in that belongs to that user
     * TODO: Remove from FS
     */
    app.post('/user/photos/delete', async (req, getres) => {
        console.log("POST - delete photo");
        // This performs the JWT authorization
        var user_id = getUserIdFromJWT(req, getres);
        if(user_id == null){
          return; // Authorization failed
        }
        else{
          var isPaid = await verifyPaid(user_id);
          if(req.headers.bus != undefined){
            // If the website is making the API call
            if(req.headers.bus != "Q2cxNw=="){
              getres.status(201);
              getres.statusMessage = "Unauthorized API request";
              getres.send("Unauthorized API request");
              return;
            }
          }
          // Accessing through the API
          else{
            // If they're a paid API user and trying to access API not thru website
            if(!isPaid){
              // If they're not paid, isPaid returns error
              getres.status(303);
              getres.statusMessage = "Unauthorized: Free User";
              getres.send("Please upgrade account to utilize this feature")
              return;
            }
          }
          stat.logStatRequest(user_id);
        var photoId = req.body.photo_id;
        var userId = req.body.user_id;
        if(photoId == null || userId == null){
          getres.status(406);
          getres.statusMessage = "Missing info";
          getres.send("Missing information. Refer to API documentation for all necessary information.");
          return;
        }
        var queryText = "DELETE FROM user_photo WHERE photo_id = $1 AND user_id = $2;";
        console.log(queryText);
        var values = [photoId, userId];
        result = await db.param_query(queryText, values);
        queryText = "DELETE FROM photos WHERE photo_id = $1;";
        values = [photoId];
        console.log(queryText);
        result = await db.param_query(queryText, values);
        getres.send("Delete was a success!");
      }
    });

    /**
     * Deletes the video id passed in that belongs to that user
     * TODO: Remove from FS
     */
    app.post('/user/videos/delete', async (req, getres) => {
        console.log("POST - delete video");
        console.log(req.body);
        // This performs the JWT authorization
        var user_id = getUserIdFromJWT(req, getres);
        if(user_id == null){
          return; // Authorization failed
        }
        else{
          var isPaid = await verifyPaid(user_id);
          if(req.headers.bus != undefined){
            // If the website is making the API call
            if(req.headers.bus != "Q2cxNw=="){
              getres.status(201);
              getres.statusMessage = "Unauthorized API request";
              getres.send("Unauthorized API request");
              return;
            }
          }
          // Accessing through the API
          else{
            // If they're a paid API user and trying to access API not thru website
            if(!isPaid){
              // If they're not paid, isPaid returns error
              getres.status(303);
              getres.statusMessage = "Unauthorized: Free User";
              getres.send("Please upgrade account to utilize this feature")
              return;
            }
          }
          stat.logStatRequest(user_id);
        var videoId = req.body.video_id;
        var userId = req.body.user_id;
        if(videoId == null || userId == null){
          getres.status(406);
          getres.statusMessage = "Missing info";
          getres.send("Missing information. Refer to API documentation for all necessary information.");
          return;
        }
        var queryText = "DELETE FROM user_video WHERE video_id = $1 AND user_id = $2;";
        console.log(queryText);
        var values = [videoId, userId];
        result = await db.param_query(queryText, values);
        queryText = "DELETE FROM videos WHERE video_id = $1;";
        console.log(queryText);
        values = [videoId];
        result = await db.param_query(queryText, values);
        getres.send("Delete was a success!");
      }
    });

    /**
     * Returns photos the user chooses to display on their profile
     */
    app.get('/user/photos/display', async (req, getres) => {
        console.log("GET - user profile display photos");
        // This performs the JWT authorization
        if(req.headers.bus != undefined){
          // If the website is making the API call
          if(req.headers.bus != "Q2cxNw=="){
            getres.status(201);
            getres.statusMessage = "Unauthorized API request";
            getres.send("Unauthorized API request");
            return;
          }
        }
        // Accessing through the API
        else{
          // This performs the JWT authorization
          var user_id = getUserIdFromJWT(req, getres);
          if(user_id == null){
            return; // Authorization failed
          }
          var isPaid = await verifyPaid(user_id);
          // If they're a paid API user and trying to access API not thru website
          if(!isPaid){
            // If they're not paid, isPaid returns error
            getres.status(303);
            getres.statusMessage = "Unauthorized: Free User";
            getres.send("Please upgrade account to utilize this feature")
            return;
          }
        }
        stat.logStatRequest(0);
        var id = req.query.id;
        var id = req.query.user_id;
        if(id == null){
          getres.status(406);
          getres.statusMessage = "Missing info";
          getres.send("Missing information. Refer to API documentation for all necessary information.");
          return;
        }
        let queryText = "SELECT * FROM PHOTOS WHERE photo_id in (SELECT photo_id FROM USER_PHOTO WHERE user_ID = $1 AND status = 'done') AND display = true;";
        let values = [id];
        db.param_query(queryText, values)
            .then(res => {
                getres.send(res.rows);
            })
            .catch(e => console.error(e.stack))
    });

    /**
     * Returns videos the user chooses to display on their profile
     */
    app.get('/user/videos/display', async (req, getres) => {
        console.log("GET - user profile display videos");
        // This performs the JWT authorization
        if(req.headers.bus != undefined){
          // If the website is making the API call
          if(req.headers.bus != "Q2cxNw=="){
            getres.status(201);
            getres.statusMessage = "Unauthorized API request";
            getres.send("Unauthorized API request");
            return;
          }
        }
        // Accessing through the API
        else{
          // This performs the JWT authorization
          var user_id = getUserIdFromJWT(req, getres);
          if(user_id == null){
            return; // Authorization failed
          }
          var isPaid = await verifyPaid(user_id);
          // If they're a paid API user and trying to access API not thru website
          if(!isPaid){
            // If they're not paid, isPaid returns error
            getres.status(303);
            getres.statusMessage = "Unauthorized: Free User";
            getres.send("Please upgrade account to utilize this feature")
            return;
          }
        }
        stat.logStatRequest(0);
        var id = req.query.id;
        var id = req.query.user_id;
        if(id == null){
          getres.status(406);
          getres.statusMessage = "Missing info";
          getres.send("Missing information. Refer to API documentation for all necessary information.");
          return;
        }
        let queryText = "SELECT * FROM VIDEOS WHERE video_id in (SELECT video_id FROM user_video WHERE user_ID = $1 AND status = 'done') AND display = true;";
        let values = [id];
        db.param_query(queryText, values)
            .then(res => {
                getres.send(res.rows);
            })
            .catch(e => console.error(e.stack))
    });

    /**
     * Returns the number of photos the user has
     */
    app.get('/user/photos/num', async (req, getres) => {
      // This performs the JWT authorization
      if(req.headers.bus != undefined){
        // If the website is making the API call
        if(req.headers.bus != "Q2cxNw=="){
          getres.status(201);
          getres.statusMessage = "Unauthorized API request";
          getres.send("Unauthorized API request");
          return;
        }
      }
      // Accessing through the API
      else{
        // This performs the JWT authorization
        var user_id = getUserIdFromJWT(req, getres);
        if(user_id == null){
          return; // Authorization failed
        }
        var isPaid = await verifyPaid(user_id);
        // If they're a paid API user and trying to access API not thru website
        if(!isPaid){
          // If they're not paid, isPaid returns error
          getres.status(303);
          getres.statusMessage = "Unauthorized: Free User";
          getres.send("Please upgrade account to utilize this feature")
          return;
        }
      }
      stat.logStatRequest(0);
      console.log("GET - number of photos");
      let queryText = "SELECT COUNT(*) FROM user_photo WHERE user_id = $1";
      let values = [req.query.user_id];
      result = await db.param_query(queryText, values)
      console.log(result.rows[0])
      if(result.rows[0].count >= MAX_PHOTO_UPLOADS_FREE){
        getres.status(605);
        getres.statusMessage = "Max uploads";
        getres.send("You have reached your max of 2 uploaded images. Please remove images before continuing.");
        return;
      }
      getres.send(result.rows[0]);
    });

}