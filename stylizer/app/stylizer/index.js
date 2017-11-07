const util = require('util');
const execFile = util.promisify(require('child_process').execFile);
const config = require('../../config.js');

const log = (msg) => {console.log("STYLIZER: " + msg)};

module.exports = {
  test: function(text) {
    return text;
  },
  
	// "Run" refers to a styling run
  startStyle: function(runParams) {

    const options = [
      //stylizerPath + 'test.lua',
      'test.lua',
      '-content', runParams.contentPath,
      '-contentSize', runParams.contentSize,
      '-style', runParams.stylePath,
      '-styleSize', runParams.styleSize,
      '-gpu', config.gpu,
      '-outputDir', config.outputPath,
      '-outputName', runParams.outputName
    ];

    log(`runId ${runParams.runId} started`);
    return execFile(config.thPath, options, {'cwd': config.stylizerPath})
      .catch((err) => {
        log(`The following error occurred with runId ${runParams.runId}`);
        console.log(err);
        throw err;
      })
      .then((result) => {
        log(`Styling runId ${runParams.runId} completed succesfully.`);
      });
  }, 

  runComplete: function(runId, imagePath) {

  }

}
