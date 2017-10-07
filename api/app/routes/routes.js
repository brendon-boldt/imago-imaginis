const stylizer = require('../stylizer');

module.exports = function(app) {
  
  app.get('/', (req, res) => {
    /*
    let response;
    try {
      response = await stylizer.style();
    } catch (err) {
      console.log('Error: ' + err);
      return;
    }
    res.json({ message: response });
    */
    return stylizer.startStyle()
      .catch((err) => {
        throw err;
      })
      .then((response) => {
        res.json({ message: response });
      })
  })

  app.post('/test', (req, res) => {
    console.log(req.query);
    res.send('Hello');
  });
};
