###Why
Since we're not doing PHP, and using Angular instead, we need to have all communications to our server done
through the usage of API calls. This is easy to setup, and it kills two birds with one stone (API for customer, and communication to our server backend for the web UI).

###Overview
You need three things installed: Node, and the node modules Express and body-parser.
You should also install nodemon, it auto-restarts Express server on file change.

So we have server.js which bootstraps and starts the Express server.
routes/index.js is the place where we specify all the different routes the API makes available.
You can test these routes using a REST client (I prefer Chrome extension Restlet Client) (try a GET on localhost:8000/test).
routes/routes.js and routes/moreroutes.js just define the routes.

Start the Express server by running npm run dev (have to add "dev": "nodemon server.js" to scripts attribute in package.json)
Perform REST API calls on localhost:8000.

###Connecting to Postgres
db/index.js is the place where we make the connection to the Postgres server.
Read up on https://node-postgres.com/ it's easy enough. We're using the Node client for Postgres,
so that the web/API users can access the database.