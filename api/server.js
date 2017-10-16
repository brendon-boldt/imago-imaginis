const express = require('express');
const bodyParser = require('body-parser');
const mountRoutes = require('./app/routes');

const app = express();
// mountRoutes(app);

const port = 8000;

//This allows Express to process URL encoded forms on its own.
//This way, we don't get undefined when receiving JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw({limit: '50mb'}));

require('./app/routes')(app);

app.listen(port, () => {
    console.log('We are live on ' + port);
})
