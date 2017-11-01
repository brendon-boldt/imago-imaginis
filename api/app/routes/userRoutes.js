const db = require('../db');
const multer = require('multer'); 
const path = require('path');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

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
   * Inserts an entry into the asp_users' table
   * Takes in the request body's parameters
   */
  app.post('/user/create', (req, getres) => {
    console.log("POST - create account");
    var firstName = req.body.first_name;
    var lastName = req.body.last_name;
    var email = req.body.email;
    var password = req.body.password; // Hash password
    const hash = crypto.createHash('sha256');
    hash.update(password);
    password = hash.digest('hex');
    var date = new Date(Date.now()).toLocaleDateString();
    let queryText = "INSERT INTO asp_users (first_name, last_name, email, password, date_joined, status) VALUES ('" + firstName + "', '" + lastName + "', '" + email + "', '" + password + "', '" + date + "', true);";
    console.log("Query: " + queryText);
    db.query(queryText)
      .then(res => {
        if(res != undefined){
          console.log("Account creation successful!");
          getres.send("Account creation successful!");
        }
        else{
          getres.send("Account creation failed");
        }
      })
      .catch(e => console.error(e.stack))
  });

  /**
   * Takes in the request query's parameters
   * Signs a JWT token and returns it to the user
   * If the user doesn't exist, return an error
   */
  app.get('/user/login', (req, getres) => {
    console.log("GET - login");
    var email = req.query.email;
    var password = req.query.password;
    const hash = crypto.createHash('sha256');
    hash.update(password);
    password = hash.digest('hex');
    let queryText = "SELECT * FROM asp_users WHERE email = '" + email + "' AND password = '" + password + "';";
    db.query(queryText)
      .then(res => {
        if(res.rows[0] != null){
          // Puts various user information into the JWT
          var payload = {
            user_id: res.rows[0].user_id,
            first_name: res.rows[0].first_name,
            last_name: res.rows[0].last_name,
            email: email,
          };
          var token = jwt.sign(payload, "thisisthekey", { expiresIn: '1h'}); // Sets the token to expire in an hour
          var decoded = jwt.verify(token, "thisisthekey"); // For reference
          // console.log({
          //   token: token,
          //   rows: res.rows[0]
          // });
          // Return the token to the user
          getres.send(token);
          // getres.send(res.rows[0]);
        }
        else{
          getres.send("User not found");
        }
      })
      .catch(e => console.error(e.stack))
  });

  /**
   * Returns users that match a query string
   * Takes in the request query's parameters
   */
  app.get('/user/search', (req, getres) => {
    console.log("GET - search");
    var searchString = req.query.searchString;
    let queryText = "SELECT * FROM ASP_USERS WHERE first_name::text || last_name::text LIKE '%" +  searchString + "%'";
    db.query(queryText)
      .then(res => {
        console.log(res.rows);
        getres.send(res.rows);
      })
      .catch(e => console.error(e.stack))
  });
  
  /**
   * Returns user info for user with id
   * Takes in the request query's parameters
   */
  app.get('/user/info', (req, getres) => {
    console.log("GET - info");
    var id = req.query.id;
    let queryText = "SELECT * FROM ASP_USERS WHERE user_ID = " +  id + ";";
    db.query(queryText)
      .then(res => {
        console.log(res.rows);
        getres.send(res.rows);
      })
      .catch(e => console.error(e.stack))
  });

  /**
   * Returns user profile picture for user with id
   * Takes in the request query's parameters
   */
  app.get('/user/profile-picture', (req, getres) => {
    console.log("GET - profile picture");
    var id = req.query.id;
    let queryText = "SELECT path FROM PHOTOS WHERE photo_id = (SELECT photo_id FROM USER_PHOTO WHERE user_ID = " +  id + " AND type = 'profile');";
    db.query(queryText)
      .then(res => {
        console.log(res.rows);
        getres.send(res.rows);
      })
      .catch(e => console.error(e.stack))
  });
  
  /**
   * Modifies an entry in the asp_users' table
   * Takes in the request body's parameters
   */
  app.post('/user/alter', (req, getres) => {
    console.log("POST - alter account");
    var id = req.query.userId;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var email = req.body.email;
    var password = req.body.password; // Hash password
    var queryText;
    // If password is empty, leave it alone
    if(password == "" || password == null){
      queryText = "UPDATE asp_users SET (first_name, last_name, email) = ('" + firstName + "', '" + lastName + "', '" + email + "') WHERE user_id = " + id + ";";
    }
    else{
      console.log(password);
      const hash = crypto.createHash('sha256');
      hash.update(password);
      password = hash.digest('hex');
      queryText = "UPDATE asp_users SET (first_name, last_name, email, password) = ('" + firstName + "', '" + lastName + "', '" + email + "', '" + password + "') WHERE user_id = " + id + ";";
    }
    console.log("Query: " + queryText);
    db.query(queryText)
      .then(res => {
        if(res != undefined){
          console.log("Account update successful!");
          getres.send("Account update successful!");
        }
        else{
          getres.send("Account update failed");
        }
      })
      .catch(e => console.error(e.stack))
    });

  /**
   * Returns user's photos for user with id
   * Takes in the request query's parameters
   */
  app.get('/user/photos', (req, getres) => {
    console.log("GET - user photos");
    var id = req.query.id;
    let queryText = "SELECT * FROM PHOTOS WHERE photo_id in (SELECT photo_id FROM USER_PHOTO WHERE user_ID = " +  id + " AND type = 'styled')";
    db.query(queryText)
      .then(res => {
        console.log(res.rows);
        getres.send(res.rows);
      })
      .catch(e => console.error(e.stack))
  });

  /**
   * Creates a paid user with id
   * Takes in the request body's parameters
   */
  app.post('/user/paid', (req, getres) => {
    console.log("Post - create paid user");
    var id = req.body.id;
    var queryText = "SELECT * FROM Paid_Users WHERE user_id = '" + id + "';";
    db.query(queryText)
      .then(res => {
		  if (res == undefined) {
          getres.send("Paid user creation failed");
		  }
		  if (res.rowCount === 0) {
			  queryText = "INSERT INTO Paid_Users (user_ID) VALUES ('" + id + "');";
			  db.query(queryText).then(res => {
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

   /* Performs a profile photo upload
   * https://github.com/expressjs/multer/issues/170
   */
  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, config.uploadsPath)
    },
    filename: function (req, file, cb) {
        var filename = file.fieldname + '-' + Date.now() + path.extname(file.originalname)
        cb(null, filename);
    }
  });
  // "SELECT path FROM PHOTOS WHERE photo_id = (SELECT photo_id FROM USER_PHOTO WHERE user_ID = " +  id + " AND type = 'profile');";
  app.post('/user/upload/profile', multer({storage: storage}).single("upload"), (req, getres) => {
    // Do verification that this is indeed a photo upload
    console.log("POST - upload");
    console.log(req.file);
    getres.send(req.file);
    async function test() {
      var path = config.uploadsPath + "/" +  req.file.filename;
      // var path = req.file.filename;
      // Need to generate entry in Photos to have photo id so we can create entry in user_photo
      var queryText = "INSERT INTO photos (size, creation_date, path, process_time, flag, display, height, width) VALUES (.00000001, '1970-01-01', '" + path + "', 0, false, false, 0, 0) RETURNING photo_id;";
      console.log("Query: " + queryText);
      result = await db.query(queryText); 
      var photo_id = result.rows[0].photo_id;
      // We also need to create a new entry in User_Photo. Need to use generated unfiltered_photo_id
      // Delete profile photo they had before first
      queryText = "SELECT * FROM user_photo WHERE user_id = " + req.query.user_id + " AND type = 'profile'";
      console.log("Query: " + queryText);
      result = await db.query(queryText);
      if(result.rows[0] != null){
        console.log("User had a profile photo before!");
        var old_profile_id = result.rows[0].photo_id;
        queryText = "DELETE FROM user_photo WHERE photo_id = " + old_profile_id;
        result = await db.query(queryText);
        queryText = "DELETE FROM photos WHERE photo_id = " + old_profile_id;
        result = await db.query(queryText);
      }
      queryText = "INSERT INTO user_photo (user_id, photo_id, type, filter_id, status, wait_time) VALUES (" + req.query.user_id + ", " + photo_id + ", 'profile', " + "0" + ", 'done', 0);";
      console.log("Query: " + queryText);
      db.query(queryText); 
    }
    test();
  });
  
}