const util = require('util');
const execFile = util.promisify(require('child_process').execFile);
const config = require('../../config.js');

const log = (msg) => {console.log("STYLIZER: ", msg)};

module.exports = {

  startStyleVideo: async function(runParams) {

    // The command line args being passed to the stylzier
    const options = [
      'styVid.sh',
      runParams.contentPath,
      runParams.stylePath,
      `${config.outputPathVideo}/${runParams.outputName}`,
      runParams.contentSize,
      runParams.styleSize
    ];

    log(`video ${runParams.upId} started`);
    log('bash' + options.join(' '));
    // Record the milliseconds elapsed during the run
    let start = new Date();
    // Execute!
    await execFile('bash', options, {'cwd': config.stylizerPath})
      .catch((err) => {
        log(`The following error occurred with user_photo_id ${runParams.upId}`);
        console.log(err);
        throw err;
      })
      .then((result) => {
        log(`Styling runId ${runParams.upId} completed succesfully.`);
        //execFile('rm', [runParams.contentPath, runParams.stylePath]);
        // Remove the unstyled video since we do not need it any more
        execFile('rm', [runParams.contentPath]);
      });
    log('done');
    let obj = {};
    obj.process_time = new Date() - start;
    obj.filepath = `${config.outputPathVideo}/${runParams.outputName}`;
    return obj;
  }, 

  /**
   * Start styling an image.
   */
  startStyle: async function(runParams) {

    // Command line args to be passed to the stylizer
    const options = [
      'test.lua',
      '-content', runParams.contentPath,
      '-contentSize', runParams.contentSize,
      '-style', runParams.stylePath,
      '-styleSize', runParams.styleSize,
      '-gpu', config.gpu,
      '-outputDir', config.outputPath,
      '-outputName', runParams.outputName
    ];

    log(`runId ${runParams.upId} started`);
    // Record the duration of the run
    let start = new Date();
    // Let the image styling begin!
    await execFile(config.thPath, options, {'cwd': config.stylizerPath})
      .catch((err) => {
        log(`The following error occurred with user_photo_id ${runParams.upId}`);
        console.log(err);
        throw err;
      })
      .then((result) => {
        log(`Styling runId ${runParams.upId} completed succesfully.`);
        // Remove the unstyled image when finished
        execFile('rm', [runParams.contentPath/*, runParams.stylePath*/]);
      });
    let obj = {};
    // Calculate the elapsed
    obj.process_time = new Date() - start;
    obj.filepath = `${config.outputPath}/${runParams.outputName}`;
    return obj;
  }, 

  /**
   * Delete a file
   */
  removeResource: function(path) {
    execFile('rm', [path]);
  }

}
