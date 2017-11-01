const db = require('../db');
const multer = require('multer'); 
const path = require('path');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

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
          console.log(res.rows[0]);
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
   * Performs a profile photo upload
   * https://github.com/expressjs/multer/issues/170
   */
  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      // cb(null, '/home/administrator/files/images/uploads')
      cb(null, 'C:/Users/KaiWong/')
    },
    filename: function (req, file, cb) {
        var filename = file.fieldname + '-' + Date.now() + path.extname(file.originalname)
        cb(null, filename);
    }
  });
  app.post('/upload/profile', multer({storage: storage}).single("upload"), (req, getres) => {
    // Do verification that this is indeed a photo upload
    console.log("POST - upload");
    console.log(req.file);
    getres.send(req.file);
    async function test() {
      // var path = "/home/administrator/files/images/uploads/" + req.file.filename;
      var path = req.file.filename;
      // Need to generate entry in Photos to have photo id so we can create entry in user_photo
      var queryText = "INSERT INTO photos (size, creation_date, path, process_time, flag, display, height, width) VALUES (.00000001, '1970-01-01', '" + path + "', 0, false, false, 0, 0) RETURNING photo_id;";
      console.log("Query: " + queryText);
      result = await db.query(queryText); 
      var photo_id = result.rows[0].photo_id;
      // We also need to create a new entry in User_Photo. Need to use generated unfiltered_photo_id
      // Delete profile photo they had before first
      queryText = "INSERT INTO user_photo (user_id, photo_id, type, filter_id, status, wait_time) VALUES (" + req.query.user_id + ", " + photo_id + ", 'profile', " + "0" + ", 'done', 0);";
      console.log("Query: " + queryText);
      db.query(queryText); 
    }
    test();
  });
}