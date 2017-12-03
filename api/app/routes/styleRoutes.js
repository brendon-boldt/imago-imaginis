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

let shouldWatermark = async function(resource_id, type){
  if (type !== 'image') {
    return false;
  }
  // Return true if jwt is paid user, else return false
  // Look up user id and see if they're a paid user
  //let queryText = "SELECT * FROM ASP_USERS LEFT JOIN paid_users ON asp_users.user_id = paid_users.paid_id WHERE user_ID = $1;";
  let queryText = 'SELECT * FROM ASP_USERS LEFT JOIN paid_users ON asp_users.user_id = paid_users.paid_id LEFT JOIN user_photo ON (user_photo.user_id = paid_users.paid_id) WHERE photo_id = $1';
  let values = [resource_id];
  result = await db.param_query(queryText, values)
  console.log(result.rows[0])
  //if(result.rows[0] !== null){
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


module.exports = function(app) {
  app.post('/style/insert/:type*', async (req, getres) => {
    console.log("Upload of type: " + req.params.type);

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

    console.log("QUERY: ", req.query);
    let filepath = `${outputPath}/output-${req.query.resource_id}.${req.query.fileType}`; 
    console.log(`Writing file: ${filepath}`);
    fs.writeFile(filepath, req.body, async (err) => {
        if (err) {
          throw err;    
        }
        //execFile('rm', [config.contentPath+`/upload-${uf_resource_id]);
        getres.json({'status': 0});
        try {
          if (await shouldWatermark(req.query.resource_id, req.params.type)) {
            await watermark.embedWatermark(filepath, options);
          }
        }
        catch(e){ console.log(e); }
      });

    let resource_id = parseInt(req.query.resource_id);
    console.log(resource_id);
    let user_id = parseInt(req.query.user_id);
    let resourceQuery = `UPDATE ${resultTable} SET (path, process_time)=($1,$2) WHERE ${resource_id_name} = $3`;
    console.log(resourceQuery); 
    let resourceParams = [filepath, req.query.process_time, resource_id];
    db.param_query(resourceQuery, resourceParams); 

    let bridgeQuery = `UPDATE ${bridgeTable} SET status='done' WHERE ${resource_id_name}=$1 AND user_id=$2`;
    let bridgeParams = [resource_id, user_id];
    console.log(bridgeQuery); 
    db.param_query(bridgeQuery, bridgeParams); 
    return 0;
  });

  app.post('/style/select/:type', (req, res) => {
    console.log("Received: ", req.body);

  

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

    // TODO: This should be its own route, but I do not have time for that now
      let processingQuery = `UPDATE ${bridgeTable} SET status='processing' WHERE ${unfilteredId}=${req.body.resource_id}`;
      console.log(processingQuery); 
      db.query(processingQuery); 
    } else
      filepath = `${config.stylePath}/filter-${req.body.resource_id}.${req.body.fileType}`;
    console.log('Sending: ' + filepath);
    res.sendFile(filepath);
  });

  // Not used?
  app.post('/style/select/run', (req, getres) => {
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

  // Multiple runs
  app.post('/style/selectRuns/:type', (req, getres) => {
    let queryText;
    if (req.params.type === 'images') {
      queryText = 'SELECT photo_id, user_id, unfiltered_photo_id, filters.filter_id, unfiltered_photo.path AS uppath, filters.path AS fpath FROM user_photo NATURAL JOIN unfiltered_photo JOIN filters ON (filters.filter_id = user_photo.filter_id) WHERE status=\'waiting\'';
    } else if (req.params.type === 'videos') {
      queryText = 'SELECT video_id, user_id, unfiltered_video_id, filters.filter_id, unfiltered_video.path AS uvpath, filters.path AS fpath FROM user_video NATURAL JOIN unfiltered_video JOIN filters ON (filters.filter_id = user_video.filter_id) WHERE status=\'waiting\'';
    }

    //console.log("QUERYING: " + queryText);
    db.query(queryText)
      .then(res => {
        console.log(res.rows);
        getres.send(res.rows);
      })
      .catch(e => console.error(e.stack));

    return 0;
  });


};

