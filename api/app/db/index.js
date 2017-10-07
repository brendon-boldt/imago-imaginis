const { Pool, Client } = require('pg');

//Client
// const client = new Client({
//     user: 'Holayn',
//     host: 'localhost',
//     database: 'testdb',
//     password: 'potpal12',
//     port: 5432,
// });

//Pool
const pool = new Pool({
    user: 'Holayn',
    host: 'localhost',
    database: 'testdb',
    password: 'potpal12',
    port: 5432,
});

// client.connect();
// pool.connect(0);

// const query = "SELECT * FROM books";

module.exports = {
    // query: (text, params, callback) => {
    //     return pool.query(text, params, callback)
    // }
    query: function(text) {
        return pool.query(text);
    },
    test: function(text) {
        return console.log(text);
    }
}

// client.query(query)
//     .then(res => {
//         console.log(res.rows[0]);
//         client.end();
//     })
//     .catch(e => console.error(e.stack))
