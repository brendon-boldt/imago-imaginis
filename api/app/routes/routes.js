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
	  
        //const contentPath = '/tmp/style/cornell.jpg';
        //const contentPath = '/tmp/style/cornell.jpg';
        //const contentSize = 32;
        //const stylePath = '/tmp/style/woman_in_peasant_dress.jpg';
        //const stylePath = '/tmp/style/woman_with_hat_matisse.jpg';
        //const styleSize = 32;
	let runParams = {
		contentPath : '/tmp/style/cornell.jpg',
		contentSize : 32,
		stylePath : '/tmp/style/woman_in_peasant_dress.jpg',
		styleSize : 32
	};
    return stylizer.startStyle(runParams)
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
