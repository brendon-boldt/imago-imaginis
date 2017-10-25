const routes = require('./routes.js');
const moreroutes = require('./moreroutes.js');
const styleRoutes = require('./styleRoutes.js');

module.exports = function(app){
    routes(app);
    moreroutes(app);
    styleRoutes(app);
}

// module.exports = (app) => {
//     app.use('/routes', routes);
// }
