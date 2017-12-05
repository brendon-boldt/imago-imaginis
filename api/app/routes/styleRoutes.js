const db = require('../db');
const path = require('path');
const fs = require('fs');
const formDataModule = require('form-data');
const watermark = require('image-watermark'); 
let options = {
  'text' : 'ImagoImaginis',
  'override-image' : true,
}


const config = require('../../config.js');

/**
 * If the user is not a paid user, a watermark should be applied
 */
let shouldWatermark = async function(resource_id, type){
  if (type !== 'image') {
    return false;
  }
  let queryText = 'SELECT * FROM ASP_USERS LEFT JOIN paid_users ON asp_users.user_id = paid_users.paid_id LEFT JOIN user_photo ON (user_photo.user_id = paid_users.paid_id) WHERE photo_id = $1';
  let values = [resource_id];
  result = await db.param_query(queryText, values)
  console.log(result.rows[0])
  console.log(result.rows);
  if(result.rows.length !== 0){
    console.log("VERIFY: Paid user, NO WATERMARK");
    return false;
  } else{
    // They are a free user
    console.log("VERIFY: Free user, WATERMARK");
    return true;
  }
}

/**
 * Make sure that the authentication token is correct
 */
let verifyRequest = function(req) {
  return req.query.token === config.styleApiToken;
}

/**
 * Template response to failed authentication 
 */
let verificationFailed = function(res) {
  res.status(401);
  res.statusMessage = "Unauthorized style request";
  res.send("Unauthorized style request");
}


module.exports = function(app) {

  /**
   * If any images/videos are stuck in the 'processing' state, set them to
   * 'waiting' so that they can get styled
   */
  app.get('/style/refresh/:type', async (req, getres) => {
    if (!verifyRequest(req)) {
      verificationFailed(getres);
      return;
    }

    let refreshVideos = "update user_video set status = 'waiting' where status = 'processing'";
    let refreshPhotos = "update user_photo set status = 'waiting' where status = 'processing'";
    if (req.params.type === "images") {
      db.query(refreshPhotos);
    } else if (req.params.type === "videos") {
      db.query(refreshVideos);
    } else if (req.params.type === "both") { 
      db.query(refreshPhotos);
      db.query(refreshVideos);
    }

    getres.send();
  });


  /**
   * Insert an image or video that has been styled
   */
  app.post('/style/insert/:type*', async (req, getres) => {
    if (!verifyRequest(req)) {
      verificationFailed(getres);
      return;
    }

    console.log("Upload of type: " + req.params.type);
    // The query will need to be different for an image or video
    let outputPath, bridgeTable, resultTable, resource_id_name;
    if (req.params.type === 'image') {
      outputPath = config.outputPath;
      bridgeTable = 'user_photo';
      resultTable = 'photos';
      resource_id_name = 'photo_id';
    } else {
      outputPath = config.outputPathVideo;
      bridgeTable = 'user_video';
      resultTable = 'videos';
      resource_id_name = 'video_id';
    }

    let filepath = `${outputPath}/output-${req.query.resource_id}.${req.query.fileType}`; 
    console.log(`Writing file: ${filepath}`);
    fs.writeFile(filepath, req.body, async (err) => {
      if (err) {
        throw err;    
      }
      //execFile('rm', [config.contentPath+`/upload-${uf_resource_id]);
      getres.json({'status': 0});
      try {
        // If the user is a free user, watermark the styled image
        if (await shouldWatermark(req.query.resource_id, req.params.type)) {
          await watermark.embedWatermark(filepath, options);
        }
      }
      catch(e){ console.log(e); }
    });

    let resource_id = parseInt(req.query.resource_id);
    let user_id = parseInt(req.query.user_id);
    let resourceQuery = `UPDATE ${resultTable} SET (path, process_time)=($1,$2) WHERE ${resource_id_name} = $3`;
    let resourceParams = [filepath, req.query.process_time, resource_id];
    // Update the path and the processing time of the photo/video entry in the DB
    db.param_query(resourceQuery, resourceParams); 

    let bridgeQuery = `UPDATE ${bridgeTable} SET status='done' WHERE ${resource_id_name}=$1 AND user_id=$2`;
    let bridgeParams = [resource_id, user_id];
    // Update the corresponding run information in the DB
    db.param_query(bridgeQuery, bridgeParams); 
    return 0;
  });

  /**
   * Retrieve an image from the DB
   */
  app.post('/style/select/:type', (req, res) => {
    if (!verifyRequest(req)) {
      verificationFailed(getres);
      return;
    }

    // Determine how to name the file: image/video and content/style
    let filepath = 'UNSET';
    if (req.body.type === 'content') {
      let contentPath;
      let bridgeTable;
      let unfilteredId;
      if (req.params.type === 'image') {
        contentPath = config.contentPath;
        bridgeTable = 'user_photo';
        unfilteredId = 'unfiltered_photo_id';
      } else {
        contentPath = config.contentPathVideo;
        bridgeTable = 'user_video';
        unfilteredId = 'unfiltered_video_id';
      }

      filepath = `${contentPath}/upload-${req.body.resource_id}.${req.body.fileType}`;

      // If the style server is retrieving a content image/video, set the
      // status of that run to 'processing' so that it will not be restyled
      let processingQuery = `UPDATE ${bridgeTable} SET status='processing' WHERE ${unfilteredId}=${req.body.resource_id}`;
      db.query(processingQuery); 
    } else {
      filepath = `${config.stylePath}/filter-${req.body.resource_id}.${req.body.fileType}`;
    }
    console.log('Sending: ' + filepath);
    res.sendFile(filepath);
  });

  /**
   * Get the information for a given run in the DB
   */
  app.post('/style/select/run', (req, getres) => {
    if (!verifyRequest(req)) {
      verificationFailed(getres);
      return;
    }
    let user_id = parseInt(req.body.user_id);
    let photo_id = parseInt(req.body.photo_id);
    let queryText =
      `SELECT * FROM user_photo WHERE user_id=${user_id} AND photo_id=${photo_id}`;

    console.log("QUERYING: " + queryText);
    db.query(queryText)
      .then(res => {
        console.log(res.rows);
        getres.send(res.rows);
      })
      .catch(e => console.error(e.stack));

    return 0;
  });

  /**
   * Get all of the runs of one type (image/vide)
   */
  app.post('/style/selectRuns/:type', (req, getres) => {
    if (!verifyRequest(req)) {
      verificationFailed(getres);
      return;
    }
    let queryText;
    if (req.params.type === 'images') {
      queryText = 'SELECT photo_id, user_id, unfiltered_photo_id, filters.filter_id, unfiltered_photo.path AS uppath, filters.path AS fpath FROM user_photo NATURAL JOIN unfiltered_photo JOIN filters ON (filters.filter_id = user_photo.filter_id) WHERE status=\'waiting\'';
    } else if (req.params.type === 'videos') {
      queryText = 'SELECT video_id, user_id, unfiltered_video_id, filters.filter_id, unfiltered_video.path AS uvpath, filters.path AS fpath FROM user_video NATURAL JOIN unfiltered_video JOIN filters ON (filters.filter_id = user_video.filter_id) WHERE status=\'waiting\'';
    }

    db.query(queryText)
      .then(res => {
        console.log(res.rows);
        getres.send(res.rows);
      })
      .catch(e => console.error(e.stack));

    return 0;
  });


};

