const routes = require('./routes.js');
const userRoutes = require('./userRoutes.js');

module.exports = function(app){
    routes(app);
    userRoutes(app);
}

// module.exports = (app) => {
//     app.use('/routes', routes);
// }