const webRoutes = require('./webRoutes.js');
const userRoutes = require('./userRoutes.js');
const styleRoutes = require('./styleRoutes.js');
const uploadRoutes = require('./uploadRoutes.js');

module.exports = function(app){
    webRoutes(app);
    userRoutes(app);
    styleRoutes(app);
    uploadRoutes(app);
}

// module.exports = (app) => {
//     app.use('/routes', routes);
// }
