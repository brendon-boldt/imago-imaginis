const { Pool, Client } = require('pg');
const config = require('../../config.js');

// https://node-postgres.com/features/pooling

// Pool
const pool = new Pool({
    user: config.dbUserName,
    host: config.dbIP,
    database: config.dbName,
    password: config.dbPassword,
    port: config.dbPort,
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack)
  }
  client.query('SELECT NOW()', (err, result) => {
    release()
    if (err) {
      return console.error('Error executing query', err.stack)
    }
    console.log("Connected to DB!");
    console.log(result.rows)
  })
})

module.exports = {
    // query: (text, params, callback) => {
    //     return pool.query(text, params, callback)
    // }
    param_query: function(text, params) {
        // const query = {
        //     text: text,
        //     values: params
        // }
        console.log("Params: " +params);
        console.log("Performing a query");
        return pool.query(text, params);
    },
    // no_param_query: function(text){
    //     return pool.query(text);
    // },
    query: function(text){
        return pool.query(text);
    },
    test: function(text) {
        return console.log(text);
    }
}

