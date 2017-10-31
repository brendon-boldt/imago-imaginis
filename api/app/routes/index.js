const webRoutes = require('./webRoutes.js');
const userRoutes = require('./userRoutes.js');

module.exports = function(app){
    webRoutes(app);
    userRoutes(app);
}

// module.exports = (app) => {
//     app.use('/routes', routes);
// }