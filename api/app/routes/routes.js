const db = require('../db');
const multer = require('multer'); 
const path = require('path');

module.exports = function(app) {
  app.post('/test', (req, res) => {
    console.log(req.query);
    res.send('Hello');
  });
  // Login takes two parameters - the username and the password
  app.get('/login', (req, getres) => {
    console.log("GET - login");
    let queryText = 'SELECT * FROM asp_users WHERE email = $1 AND password = $2';
    console.log("From HTTP call: " + req.query.username + " " + req.query.password);
    let values = [req.query.username, req.query.password];
    db.query(queryText, values)
      .then(res => {
        console.log(res.rows[0]);
        getres.send(res.rows[0]);
      })
      .catch(e => console.error(e.stack))
  });
  // Filters returns filter ids and their names
  app.get('/filters', (req, getres) => {
    console.log("GET - filters");
    let queryText = 'SELECT * FROM filters';
    db.no_param_query(queryText)
      .then(res => {
        console.log(res.rows);
        getres.send(res.rows);
      })
      .catch(e => console.error(e.stack))
  });

  // Photo upload
  // https://github.com/expressjs/multer/issues/170
  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'C:/Users/KaiWong/')
    },
    filename: function (req, file, cb) {
        var filename = file.fieldname + '-' + Date.now() + path.extname(file.originalname)
        cb(null, filename);
    }
  });
  app.post('/upload', multer({storage: storage}).single("upload"), (req, getres) => {
    console.log("POST - upload");
    console.log(req.file);
    getres.send(req.file);
    // Create a new entry in the database in Photos
    var path = "somepath\\" + req.file.path;
    let queryText = "INSERT INTO photos (filter_id, size, creation_date, path, process_time) VALUES (" + req.query.filter_id + ", 3.0, '2017-10-18', '" + path + "', 5)";
    console.log("Query: " + queryText);
    db.no_param_query(queryText); 
  });
};