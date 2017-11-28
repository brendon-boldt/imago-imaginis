const fs = require('fs');
//const request = require('request');
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
//const insertRunPath = 'style/insertRun';

const log = (msg) => {console.log("DB: ", msg)};

var currentCounter = 0;

module.exports = {

  refreshProcessing: async function(type) {
    let options = {
      qs: {
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
   * Retrieve an image from the database
   * type: [ 'content' | 'style' ]
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
      encoding: null,
      headers: { 'Content-Type': 'multipart/form-data'}
    };

    let filename = 'UNSET';

    await request(options, async (err, res, body) => {

      // TODO: The error handling here does not work for DB side error
      if (err) {
        log(err);
        return;
      } else if (body.length === 0) {
        log ("ERROR: Empty file received.");
        return;
      }
      
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

      await fs.writeFile(filename, body, (err) => {
        if (err) { log(err); return -1; }
        return;
      });
      return filename;
    });
    return filename;
  },

  // Load an image into the database
  insertResource: async function(url, outputFPath, fileType, runInfo) {
    //let imagePath = `${config.outputPath}/${photo_id}.jpg`;
    console.log("Reading: " + outputFPath);
    fs.readFile(outputFPath, async (err, data) => {
      if (err) {
        console.log(`Could not read image ${outputFPath}.`);
        return;
      }

      let resource_id = (runInfo.photo_id !== undefined) ? runInfo.photo_id : runInfo.video_id; 
      options = { 
        qs: {
          token: config.styleApiToken,
          resource_id: resource_id,
          user_id: runInfo.user_id,
          fileType: fileType,
          process_time: runInfo.process_time,
        },
        body: data,
        //url: `${config.dbUrl}/${urlInsertImage}`,
        url: url,
        encoding: null,
        method: 'POST',
        headers: { 'Content-Type': 'application/octet-stream'},
      };

      await request(options, (err, res, body) => {
        if (err) {
          log(err);
        }
        console.log('send complete');
      });

    });


    return 0;
  },

  // Get run information from database
  selectRun: async function(upId) {
    throw new Error('Deprecated');
    let options = {
      form: { user_id: upId[0], photo_id: upId[1] },
      qs: { token: config.styleApiToken, },
      url: config.dbUrl +'/'+ selectRunPath,
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

    return result;
  },

  // Multiple runs
  selectRuns: async function(type) {
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

    return result;
  },

  getRuns: async function(type) {
    if (currentCounter >= config.maxRuns)
      return;
    let runInfoBuf = await this.selectRuns(type);
    let runInfoArr = JSON.parse(runInfoBuf);
    log(`Got ${runInfoArr.length} runs.`);

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
    //this.doRun(runInfo);
  },

  startWatching: async function() {
    this.refreshProcessing('both');
    let getRuns = this.getRuns;
    setInterval(this.getRuns.bind(this), 1000, 'image');
    setInterval(this.getRuns.bind(this), 1000, 'video');
    //this.getRuns('video');
    //this.getRuns('image');
  },
  
  // Send run information to database
  doVideoRun: async function(runInfo) {
    // User - photo ID
    let contentFT = runInfo.uvpath.substr(-3);
    let styleFT = runInfo.fpath.substr(-3);
    let promContentFPath = this.selectResource(
        //`${config.dbUrl}/${urlSelectVideo}`,
        urlSelectVideo,
        'content', contentFT, runInfo.unfiltered_video_id);
    let promStyleFPath = this.selectResource(
        //`${config.dbUrl}/${urlSelectImage}`,
        urlSelectImage,
        'style', styleFT, runInfo.filter_id);
    let contentFPath = await promContentFPath;
    let styleFPath = await promStyleFPath;

    let upIdString = runInfo.user_id + '-' + runInfo.video_id;
    //let outputFPath = `${config.outputPath}/${runInfo.photo_id}.jpg`;
    let testRunParams = {
      upId : upIdString,
      video_id : runInfo.video_id,
      contentPath : contentFPath,
      contentSize : config.contentSizeVideo,
      stylePath : styleFPath,
      styleSize : config.styleSizeVideo,
      outputName : `${runInfo.video_id}.${contentFT}`
    };

    let styleOutputObj = await stylizer.startStyleVideo(testRunParams);
    let outputFPath = styleOutputObj.filepath;
    runInfo.process_time = styleOutputObj.process_time;

    await this.insertResource(
        //`${config.dbUrl}/${urlInsertVideo}`,
        urlInsertVideo,
        outputFPath, contentFT, runInfo);

    currentCounter -= 1;
    stylizer.removeResource(outputFPath);
  },

  // Send run information to database
  doRun: async function(runInfo) {
    // User - photo ID
    let contentFT = runInfo.uppath.substr(-3);
    let styleFT = runInfo.fpath.substr(-3);
    let promContentFPath = this.selectResource(
        //`${config.dbUrl}/${urlSelectImage}`,
        urlSelectImage,
        'content', contentFT, runInfo.unfiltered_photo_id);
    let promStyleFPath = this.selectResource(
        //`${config.dbUrl}/${urlSelectImage}`,
        urlSelectImage,
        'style', styleFT, runInfo.filter_id);
    let contentFPath = await promContentFPath;
    let styleFPath = await promStyleFPath;

    let upIdString = runInfo.user_id + '-' + runInfo.photo_id;
    //let outputFPath = `${config.outputPath}/${runInfo.photo_id}.jpg`;
    let runParams = {
      upId : upIdString,
      photo_id : runInfo.photo_id,
      contentPath : contentFPath,
      contentSize : config.contentSize,
      stylePath : styleFPath,
      styleSize : config.styleSize,
      outputName : `${runInfo.photo_id}.${contentFT}`
    };

    let styleOutputObj = await stylizer.startStyle(runParams); 
    let outputFPath = styleOutputObj.filepath;
    runInfo.process_time = styleOutputObj.process_time;
    

    await this.insertResource(
        //`${config.dbUrl}/${urlInsertImage}`,
        urlInsertImage,
        outputFPath, contentFT, runInfo);

    currentCounter -= 1;
    stylizer.removeResource(outputFPath);
  }
}
