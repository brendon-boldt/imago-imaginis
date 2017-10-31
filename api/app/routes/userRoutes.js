const db = require('../db');
const multer = require('multer'); 
const path = require('path');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const hash = crypto.createHash('sha256');

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
    console.log("Post - create account");
    var firstName = req.body.first_name;
    var lastName = req.body.last_name;
    var email = req.body.email;
    var password = req.body.password; // Hash password
    password = hash.update(password);
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
}