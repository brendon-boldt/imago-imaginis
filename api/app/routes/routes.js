const db = require('../db');

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
  })
};