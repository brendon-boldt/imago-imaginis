const express = require('express');
const bodyParser = require('body-parser');
const mountRoutes = require('./app/routes');

const app = express();

var config;
try {
    config = require('./config.js');
} catch (e) {
    console.log("ERROR: Could not find `config.js`. Have you tried copying `config.js.template` to `config.js` (and populating the relevant fields)?");
    process.exit(1);
}


// Allows for cross-origin resource sharing
// https://github.com/expressjs/cors
var cors = require('cors');

const port = 8000;

console.log(__dirname);

//This allows Express to process URL encoded forms on its own.
//This way, we don't get undefined when receiving JSON
app.use(bodyParser.json());
app.use(bodyParser.raw({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors());

console.log(config);
app.use(express.static(config.serve));

require('./app/routes')(app);
app.listen(port, () => {
    console.log('We are live on ' + port);
})
