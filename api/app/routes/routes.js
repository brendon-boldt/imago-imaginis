const db = require('../db');

module.exports = function(app) {
  app.post('/test', (req, res) => {
    console.log(req.query);
    res.send('Hello');
  });
  app.get('/dbaccess', (req, getres) => {
    console.log("GET");
    db.query('SELECT * FROM books')
        .then(res => {
          console.log(res.rows[0]);
          getres.send(res.rows[0]);
        })
        .catch(e => console.error(e.stack))
  })
};