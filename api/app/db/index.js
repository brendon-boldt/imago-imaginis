const { Pool, Client } = require('pg');

// https://node-postgres.com/features/pooling

//Pool
const pool = new Pool({
    user: 'wsadmin',
    host: '10.10.7.189',
    database: 'aspdb',
    password: 'Cg17',
    port: 5432,
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
    console.log(result.rows)
  })
})


module.exports = {
    // query: (text, params, callback) => {
    //     return pool.query(text, params, callback)
    // }
    query: function(text, params) {
        const query = {
            text: text,
            values: params
        }
        console.log("Params: " +params);
        console.log("Performing a query");
        // return pool.query(query);
        return pool.query(text, params);
    },
    test: function(text) {
        return console.log(text);
    }
}

