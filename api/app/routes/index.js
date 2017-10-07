const routes = require('./routes.js');
const moreroutes = require('./moreroutes.js');

module.exports = function(app){
    routes(app);
    moreroutes(app);
}

// module.exports = (app) => {
//     app.use('/routes', routes);
// }