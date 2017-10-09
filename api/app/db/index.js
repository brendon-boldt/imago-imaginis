

module.exports = {

  // Retrieve an image from the database
  getImage: function(imageId) {
    // DB HTTP calls
  },

  // Load an image into the database
  sendImage: function(image) {
    // DB HTTP calls
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
