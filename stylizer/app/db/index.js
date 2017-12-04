const fs = require('fs');
const request = require('request-promise-native');
const formDataModule = require('form-data');
const config = require('../../config.js');
const stylizer = require('../stylizer');

const baseUrl = 'style';
const urlSelectImage = config.dbUrl +'/'+ baseUrl + '/select/image';
const urlSelectVideo = config.dbUrl +'/'+ baseUrl + '/select/video';
const urlSelectImageRuns  = config.dbUrl +'/'+ baseUrl + '/selectRuns/images';
const urlSelectVideoRuns  = config.dbUrl +'/'+ baseUrl + '/selectRuns/videos';
const urlInsertImage = config.dbUrl +'/'+ baseUrl + '/insert/image';
const urlInsertVideo = config.dbUrl +'/'+ baseUrl + '/insert/video';
const urlRefreshProcessing = config.dbUrl +'/'+ baseUrl + '/refresh';

const log = (msg) => {console.log("DB: ", msg)};

// How many runs are currently running
// In the future, this would need to be multiple variables to distinguish
// between photos, videos, and things of different size running.
var currentCounter = 0;
var videoPollInterval = 1000; // ms
var imagePollInverval = 1000; // ms

module.exports = {

  /**
   * Make sure that any DB entries stuck in a half-processing state are
   * restarted properly.
   */
  refreshProcessing: async function(type) {
    let options = {
      qs: {
        // This token must be included in every DB request
        token: config.styleApiToken,
      },
      url: urlRefreshProcessing + '/' + type,
      method: 'GET',
    };

    await request(options, (err, res, body) => {
      if (err) {
        log(err);
      }
      console.log('Refresh complete');
    });
  },

  /**
   * Retrieve an image or video from the database
   * useType: [ 'content' | 'style' ]
   * fileType: [ 'mp4' | 'jpg' | 'png' ]
   */
  selectResource: async function(url, useType, fileType, resource_id) {
    let options = {
      form: {
        resource_id: resource_id,
        type: useType,
        fileType: fileType
      },
      qs: {
        token: config.styleApiToken,
      },
      url: url,
      method: 'POST',
      // These are necessary for the data to transfer properly
      encoding: null,
      headers: { 'Content-Type': 'multipart/form-data'}
    };

    let filename = 'UNSET';

    await request(options, async (err, res, body) => {
      if (err) {
        log(err);
        return;
      } else if (body.length === 0) {
        log ("ERROR: Empty file received.");
        return;
      }
      
      // Determine where to store the file and what to call it
      if (fileType === 'mp4') {
        if (useType === 'content') {
          filename = `${config.contentPathVideo}`;
        } else if (useType === 'style') {
          filename = `${config.stylePathVideo}`;
        } else {
          throw new Error('Unknown type: ' + useType);
        }
      } else if (['jpg','png'].includes(fileType)) {
        if (useType === 'content') {
          filename = `${config.contentPath}`;
        } else if (useType === 'style') {
          filename = `${config.stylePath}`;
        } else {
          throw new Error('Unknown type: ' + useType);
        }
      } else {
        throw new Error('Unknown file type: ' + fileType);
      }
      filename += `/${resource_id}.${fileType}`;
      log(`Writing ${filename}`);

      // Write the file to the file system
      await fs.writeFile(filename, body, (err) => {
        if (err) { log(err); return -1; }
        return;
      });
      return filename;
    });
    return filename;
  },

  /**
   * Insert a styled image or video into the DB
   */
  insertResource: async function(url, outputFPath, fileType, runInfo) {
    console.log("Reading: " + outputFPath);
    // Read the file from the file system
    fs.readFile(outputFPath, async (err, data) => {
      if (err) {
        console.log(`Could not read image ${outputFPath}.`);
        return;
      }

      // Determine whether the resource is a photo or a video
      let resource_id = (runInfo.photo_id !== undefined) ? runInfo.photo_id : runInfo.video_id; 
      options = { 
        qs: {
          token: config.styleApiToken,
          resource_id: resource_id,
          user_id: runInfo.user_id,
          fileType: fileType,
          // How much time the run took to process
          process_time: runInfo.process_time,
        },
        body: data,
        url: url,
        encoding: null,
        method: 'POST',
        headers: { 'Content-Type': 'application/octet-stream'},
      };

      // Send everything to the DB server
      await request(options, (err, res, body) => {
        if (err) {
          log(err);
        }
        console.log('send complete');
      });

    });


    return 0;
  },

  /**
   * Retrieve run information from the DB for photos/videos that need
   * need to be styled.
   */
  selectRuns: async function(type) {
    // Make the request to the proper URL
    let url;
    if (type === 'image')
      url = urlSelectImageRuns; 
    else if (type === 'video')
      url = urlSelectVideoRuns; 
    else
      throw new Error('Type not recognized: ' + type);

    let options = {
      qs: {token: config.styleApiToken, },
      url: url,
      method: 'POST',
      encoding: null,
      headers: { 'Content-Type': 'multipart/form-data'}
    };

    let result = await request(options, (err, res, body) => {
      if (err) {
        log(err);
        return;
      } else if (body.length === 0) {
        log ("ERROR: Empty response received.");
        return;
      }
      return body;
    });

    // Return the array of rows retrieved from the DB
    return result;
  },

  /**
   * Retrieve runs from the DB and decide which one to style first.
   * In the future, more sophisticated load balancing would be handled here.
   */
  getRuns: async function(type) {
    // If the server is already at capacity, do nothing
    if (currentCounter >= config.maxRuns)
      return;
    // Retrieve the info from the DB
    let runInfoBuf = await this.selectRuns(type);
    let runInfoArr = JSON.parse(runInfoBuf);
    log(`Got ${runInfoArr.length} runs.`);

    // Keep starting styling runs until the server is at capacity
    let R = runInfoArr;
    for (let i = 0; i < R.length; ++i) {
      console.log('counter: ', currentCounter);
      if (currentCounter >= config.maxRuns)
        return;
      if (type === 'image') {
        currentCounter += 1;
        this.doRun(R[i]);
      } else { 
        currentCounter += 1;
        this.doVideoRun(R[i]);
      }
    }
  },

  /**
   * Set intervals which will poll the DB for images/videos to style
   */
  startWatching: async function() {
    // Make sure there is nothing stuck 'processing'
    this.refreshProcessing('both');
    let getRuns = this.getRuns;
    setInterval(this.getRuns.bind(this), imagePollInverval, 'image');
    setInterval(this.getRuns.bind(this), videoPollInterval, 'video');
  },
  
  /**
   * Perform a video styling run and push it to the DB
   */
  doVideoRun: async function(runInfo) {
    // Get the file types
    let contentFT = runInfo.uvpath.substr(-3);
    let styleFT = runInfo.fpath.substr(-3);
    // Get the promises for resources (so both requests can run concurrently)
    let promContentFPath = this.selectResource(
        urlSelectVideo,
        'content', contentFT, runInfo.unfiltered_video_id);
    let promStyleFPath = this.selectResource(
        urlSelectImage,
        'style', styleFT, runInfo.filter_id);
    // Filepaths to the resources
    let contentFPath = await promContentFPath;
    let styleFPath = await promStyleFPath;

    
    // ID string to distinguish the run from others
    let upIdString = runInfo.user_id + '-' + runInfo.video_id;
    // Run configuration information
    let runParams = {
      upId : upIdString,
      video_id : runInfo.video_id,
      contentPath : contentFPath,
      contentSize : config.contentSizeVideo,
      stylePath : styleFPath,
      styleSize : config.styleSizeVideo,
      outputName : `${runInfo.video_id}.${contentFT}`
    };

    // Start the video styling
    let styleOutputObj = await stylizer.startStyleVideo(runParams);
    let outputFPath = styleOutputObj.filepath;
    runInfo.process_time = styleOutputObj.process_time;
    // Stylizer is no longer styling this run
    currentCounter -= 1;

    // Send the styled video the server
    this.insertResource(
        urlInsertVideo,
        outputFPath, contentFT, runInfo);

    stylizer.removeResource(outputFPath);
  },

  /**
   * Perform an image styling run and push it to the DB
   */
  doRun: async function(runInfo) {
    let contentFT = runInfo.uppath.substr(-3);
    // Get the file types
    let styleFT = runInfo.fpath.substr(-3);
    let promContentFPath = this.selectResource(
        urlSelectImage,
        'content', contentFT, runInfo.unfiltered_photo_id);
    let promStyleFPath = this.selectResource(
        urlSelectImage,
        'style', styleFT, runInfo.filter_id);
    let contentFPath = await promContentFPath;
    let styleFPath = await promStyleFPath;

    let upIdString = runInfo.user_id + '-' + runInfo.photo_id;
    // Image styling run configuration
    let runParams = {
      upId : upIdString,
      photo_id : runInfo.photo_id,
      contentPath : contentFPath,
      contentSize : config.contentSize,
      stylePath : styleFPath,
      styleSize : config.styleSize,
      outputName : `${runInfo.photo_id}.${contentFT}`
    };

    // Start the styling run
    let styleOutputObj = await stylizer.startStyle(runParams); 
    let outputFPath = styleOutputObj.filepath;
    runInfo.process_time = styleOutputObj.process_time;
    // The stylizer is no longer processing this run
    currentCounter -= 1;
    

    // Send the styled image to the DB
    this.insertResource(
        urlInsertImage,
        outputFPath, contentFT, runInfo);

    stylizer.removeResource(outputFPath);
  }
}
