const express = require('express');
const bodyParser = require('body-parser');
const mountRoutes = require('./app/routes');

const app = express();

try {
    require('./config.js');
} catch (e) {
    console.log("ERROR: Could not find `config.js`. Have you tried copying `config.js.template` to `config.js` (and populating the relevant fields)?");
    process.exit(1);
}


// Allows for cross-origin resource sharing
// https://github.com/expressjs/cors
var cors = require('cors');
// mountRoutes(app);

const port = 8000;

//This allows Express to process URL encoded forms on its own.
//This way, we don't get undefined when receiving JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors());

app.use(express.static('../../files'))


require('./app/routes')(app);
app.listen(port, () => {
    console.log('We are live on ' + port);
})
