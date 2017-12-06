/**
 * Imagino Imaginis
 * -------------------------------------
 * This binds together all the different routes to be used by the API.
 * The different routes that the API serves.
 */
const webRoutes = require('./webRoutes.js');
const userRoutes = require('./userRoutes.js');
const styleRoutes = require('./styleRoutes.js');
const uploadRoutes = require('./uploadRoutes.js');
const adminRoutes = require('./adminRoutes.js');

module.exports = function(app){
    webRoutes(app);
    userRoutes(app);
    styleRoutes(app);
    uploadRoutes(app);
    adminRoutes(app);
}
