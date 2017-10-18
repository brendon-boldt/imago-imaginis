const util = require('util');
const execFile = util.promisify(require('child_process').execFile);
const config = require('../../config.js');

const log = (msg) => {console.log("STYLIZER: " + msg)};

module.exports = {
  test: function(text) {
    return text;
  },
  
	// "Run" refers to a styling run
  startStyle: async function(runParams) {
    const options = [
      //stylizerPath + 'test.lua',
      'test.lua',
      '-content', runParams.contentPath,
      '-contentSize', runParams.contentSize,
      '-style', runParams.stylePath,
      '-styleSize', runParams.styleSize,
      '-gpu', config.gpu,
      '-outputDir', config.outputDir
    ];

    log(`runId ${runParams.runId} started`);
    execFile(config.thPath, options, {'cwd': config.stylizerPath})
      .catch((err) => {
        log(`The following error occurred with runId ${runParams.runId}`);
        console.log(err);
      })
      .then((result) => {
        log(`runId ${runParams.runId} completed succesfully.`);
      });
    return 'styling started';
  }, 

  runComplete: function(runId, imagePath) {

  }

}
