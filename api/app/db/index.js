const fs = require('fs');
const request = require('request');

module.exports = {

  // Retrieve an image from the database
  getImage: function(imageId) {
    // DB HTTP calls
    let requestSettings = {
      // Request URL
      url: 'http://localhost:8001/styled',
      method: 'GET',
      encoding: null
    };

    request(requestSettings, (err, res, body) => {
      fs.writeFile('/tmp/OUTPUT.JPG', body, () => {});
    });

    res.send('action completed');
  },

  // Load an image into the database
  sendImage: function(image) {
    // DB HTTP calls
    /*
    imagePath = '/tmp/style-input/cornell.jpg';
    console.log("Received: " +  req.body);
    console.log('Sending: ' + imagePath);
    res.sendFile(imagePath);
    */
    fs.readFile('/tmp/style-input/cornell.jpg', (err, data) => {
      if (err)
        return;
      options = { 
        body: data,
        url: 'http://localhost:8001/styled',
        encoding: null,
        method: 'POST',
        headers: { 'Content-Type': 'application/octet-stream'}
      };
      request(options, (err, res, body) => {
        console.log('send complete');
      });
    });
  },

  // Get run information from database
  getRun: function(runId) {
    // ...
    let runParams = {
      runId : 2401,
      contentPath : '/tmp/style/cornell.jpg',
      contentSize : 32,
      stylePath : '/tmp/style/woman_in_peasant_dress.jpg',
      styleSize : 32
    };
    return runParams;
  },

  // Send runinformation to database
  sendRun: function(run) {
    // ...
  }
}
