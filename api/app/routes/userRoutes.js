const db = require('../db');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const config = require('../../config.js');
const stat = require('./statRoutes');

module.exports = function(app) {
    /**
     * Test route
     */
    app.post('/test', (req, res) => {
        console.log(req.query);
        res.send('Hello');
    });

    /**
     * Inserts an entry into the asp_users' table
     * Takes in the request body's parameters
     */
    app.post('/user/create', (req, getres) => {
        console.log("POST - create account");
        var firstName = req.body.firstName;
        var lastName = req.body.lastName;
        var email = req.body.email;
        var password = req.body.password; // Hash password
        const hash = crypto.createHash('sha256');
        hash.update(password);
        password = hash.digest('hex');
        var date = new Date(Date.now()).toLocaleDateString();
        // Verify email is unique
        var queryText = "SELECT * FROM ASP_USERS WHERE email = $1;";
        let values = [email];
        db.param_query(queryText, values)
            .then(res => {
                if (res == undefined) {
                    getres.send("Create account failed");
                } else if (res.rowCount > 0) {
                    console.log("Email already registered to account");
                    getres.status(401);
                    getres.send("Email already registered to account");
                } else {
                    // Email is unique
                    console.log("Email is unique");
                    let queryText = "INSERT INTO asp_users (first_name, last_name, email, password, date_joined, status) VALUES ($1, $2, $3, $4, $5, true);";
                    console.log("Query: " + queryText);
                    let values = [firstName, lastName, email, password, date];
                    db.param_query(queryText, values)
                        .then(res => {
                            if (res != undefined) {
                                console.log("Account creation successful!");
                                getres.send("Account creation successful!");
                            } else {
                                getres.send("Account creation failed");
                            }
                        })
                        .catch(e => console.error(e.stack))
                }
            })
            .catch(e => console.error(e.stack))
    });

    /**
     * Modifies an entry in the asp_users' table
     * Takes in the request body's parameters
     */
    app.post('/user/alter', (req, getres) => {
        console.log("POST - alter account");
        var id = req.body.id;
        var firstName = req.body.firstName;
        var lastName = req.body.lastName;
        var email = req.body.email;
        var password = req.body.password; // Hash password
        // Verify email is unique
        var queryText = "SELECT * FROM ASP_USERS WHERE email = $1 AND user_id != $2;";
        console.log(queryText);
        let values = [email, id];
        db.param_query(queryText, values)
            .then(res => {
                if (res == undefined) {
                    getres.send("Alter account failed");
                } else if (res.rowCount > 0) {
                    console.log("Email already registered to account");
                    getres.send("Email already registered to account");
                } else {
                    // Email is unique
                    console.log("Email is unique");
                    // If password is empty, leave it alone
                    if (password == "" || password == null) {
                        queryText = "UPDATE asp_users SET (first_name, last_name, email) = ('" + firstName + "', '" + lastName + "', '" + email + "') WHERE user_id = " + id + ";";
                    } else {
                        console.log(password);
                        const hash = crypto.createHash('sha256');
                        hash.update(password);
                        password = hash.digest('hex');
                        queryText = "UPDATE asp_users SET (first_name, last_name, email, password) = ($1, $2, $3, $4) WHERE user_id = $5;";
                    }
                    console.log("new Query: " + queryText);
                    let values = [firstName, lastName, email, password, id];
                    db.param_query(queryText, values)
                        .then(res => {
                            if (res != undefined) {
                                console.log("Account update successful!");
                                getres.send("Account update successful!");
                            } else {
                                getres.send("Account update failed");
                            }
                        })
                        .catch(e => console.error(e.stack))
                }
            })
            .catch(e => console.error(e.stack))
    });

    /**
     * Takes in the request query's parameters
     * Signs a JWT token and returns it to the user
     * If the user doesn't exist, return an error
     */
    app.get('/user/login', (req, getres) => {
        console.log("GET - login");
        var email = req.query.email;
        var password = req.query.password;
        const hash = crypto.createHash('sha256');
        hash.update(password);
        password = hash.digest('hex');
        let queryText = "SELECT * FROM asp_users WHERE email = $1 AND password = $2;";
        let values = [email, password];
        db.param_query(queryText, values)
            .then(res => {
                if (res.rows[0] != null) {
					stat.logStatLogin(res.rows[0].user_id);
                    // Puts various user information into the JWT
                    var payload = {
                        user_id: res.rows[0].user_id,
                        first_name: res.rows[0].first_name,
                        last_name: res.rows[0].last_name,
                        isAdmin: res.rows[0].admin,
                        dateJoined: res.rows[0].date_joined,
                        email: email,
                    };
                    var token = jwt.sign(payload, "thisisthekey", {
                        expiresIn: '1h'
                    }); // Sets the token to expire in an hour
                    var decoded = jwt.verify(token, "thisisthekey"); // For reference
                    // console.log({
                    //   token: token,
                    //   rows: res.rows[0]
                    // });
                    // Return the token to the user
                    getres.send(token);
                    // getres.send(res.rows[0]);
                } else {
                    getres.send("User not found");
                }
            })
            .catch(e => console.error(e.stack))
    });

    /**
     * Returns users that match a query string
     * Takes in the request query's parameters
     */
    app.get('/user/search', (req, getres) => {
        console.log("GET - search");
		var requesterUserId = req.query.requesterUserId;
		stat.logStatRequest(requesterUserId);
        var searchString = "%" + req.query.searchString + "%";
        let queryText = "SELECT * FROM ASP_USERS WHERE LOWER(first_name::text || last_name::text) LIKE LOWER($1)";
        let values = [searchString];
        db.param_query(queryText, values)
            .then(res => {
                getres.send(res.rows);
            })
            .catch(e => console.error(e.stack))
    });

    /**
     * Returns user info for user with id
     * Takes in the request query's parameters
     */
    app.get('/user/info', (req, getres) => {
        console.log("GET - info $");
		var requesterUserId = req.query.requesterUserId;
		stat.logStatRequest(requesterUserId);
        var id = req.query.id;
        let queryText = "SELECT * FROM ASP_USERS WHERE user_ID = $1;";
        let values = [id];
        db.param_query(queryText, values)
            .then(res => {
                getres.send(res.rows);
            })
            .catch(e => console.error(e.stack))
    });

    /**
     * Returns user's unstyled photos for user with id
     * Takes in the request query's parameters
     */
    app.get('/user/photos/unstyled', (req, getres) => {
        console.log("GET - user unstyled photos");
		var requesterUserId = req.query.requesterUserId;
		stat.logStatRequest(requesterUserId);
        var id = req.query.id;
        let queryText = "SELECT * FROM unfiltered_photo WHERE unfiltered_photo_id IN (SELECT unfiltered_photo_id FROM USER_PHOTO WHERE user_ID = $1 AND (status = 'waiting' OR status = 'processing')) ORDER BY unfiltered_photo_id;";
        let values = [id];
        db.param_query(queryText, values)
            .then(res => {
                getres.send(res.rows);
            })
            .catch(e => console.error(e.stack))
    });

    /**
     * Returns user's unstyled videos for user with id
     * Takes in the request query's parameters
     */
    app.get('/user/videos/unstyled', (req, getres) => {
        console.log("GET - user unstyled video");
		var requesterUserId = req.query.requesterUserId;
		stat.logStatRequest(requesterUserId);
        var id = req.query.id;
        let queryText = "SELECT * FROM unfiltered_video WHERE unfiltered_video_id IN (SELECT unfiltered_video_id FROM user_video WHERE user_ID = $1 AND (status = 'waiting' OR status = 'processing')) ORDER BY unfiltered_video_id;";
        let values = [id];
        db.param_query(queryText, values)
            .then(res => {
                getres.send(res.rows);
            })
            .catch(e => console.error(e.stack))
    });

    /**
     * Creates a paid user with id
     * Takes in the request body's parameters
     */
    app.post('/user/paid', (req, getres) => {
        console.log("Post - create paid user");
		var requesterUserId = req.body.requesterUserId;
		stat.logStatRequest(requesterUserId);
        var id = req.body.id;
        var queryText = "SELECT * FROM Paid_Users WHERE user_id = $1;";
        let values = [id];
        db.param_query(queryText, values)
            .then(res => {
                if (res == undefined) {
                    getres.send("Paid user creation failed");
                }
                if (res.rowCount === 0) {
                    queryText = "INSERT INTO Paid_Users (user_ID) VALUES ($1);";
                    let values = [id];
                    db.param_query(queryText, values).then(res => {
                        if (res != undefined) {
                            console.log("Paid user created");
                            getres.send("Paid user created");
                        }
                    })
                } else {
                    console.log("User is already paid account");
                    getres.send("User is already paid account");
                }
            })
            .catch(e => console.error(e.stack))
    });

    /**
     * Set a photo to display or not on user profile on passed photo_id
     * Takes in the request body's parameters
     */
    app.post('/user/photos/set-display', (req, getres) => {
        console.log("POST - set photo to display");
		var requesterUserId = req.body.requesterUserId;
		stat.logStatRequest(requesterUserId);
        var id = req.body.photo_id;
        var display = req.body.display;
        var queryText = "UPDATE PHOTOS SET display = $1 WHERE photo_id = $2;";
        let values = [display, id];
        console.log(queryText);
        db.param_query(queryText, values)
            .then(res => {
                if (res != undefined) {
                    console.log("Photo profile display successful! Changed to " + req.body.display);
                    getres.send("Photo profile display successful! Changed to " + req.body.display);
                } else {
                    getres.send("Photo profile display change failed");
                }
            })
            .catch(e => console.error(e.stack))
    });

    /**
     * Set a video to display or not on user profile on passed video_id
     * Takes in the request body's parameters
     */
    app.post('/user/videos/set-display', (req, getres) => {
        console.log("POST - set video to display");
		var requesterUserId = req.body.requesterUserId;
		stat.logStatRequest(requesterUserId);
        var id = req.body.video_id;
        var display = req.body.display;
        var queryText = "UPDATE VIDEOS SET display = $1 WHERE video_id = $2;";
        let values = [display, id];
        console.log(queryText);
        db.param_query(queryText, values)
            .then(res => {
                if (res != undefined) {
                    console.log("Photo profile display successful! Changed to " + req.body.display);
                    getres.send("Photo profile display successful! Changed to " + req.body.display);
                } else {
                    getres.send("Photo profile display change failed");
                }
            })
            .catch(e => console.error(e.stack))
    });

    /**
     * Returns user's styled videos for user with id
     * Takes in the request query's parameters
     */
    app.get('/user/videos', (req, getres) => {
        console.log("GET - user videos");
		var requesterUserId = req.query.requesterUserId;
		stat.logStatRequest(requesterUserId);
        var id = req.query.id;
        let queryText = "SELECT * FROM VIDEOS WHERE video_id IN (SELECT video_id FROM USER_VIDEO WHERE user_ID = $1 AND status = 'done') ORDER BY video_id;";
        let values = [id];
        db.param_query(queryText, values)
            .then(res => {
                getres.send(res.rows);
            })
            .catch(e => console.error(e.stack))
    });

    /**
     * Returns user's styled photos for user with id
     * Takes in the request query's parameters
     */
    app.get('/user/photos', (req, getres) => {
        console.log("GET - user photos");
		var requesterUserId = req.query.requesterUserId;
		stat.logStatRequest(requesterUserId);
        var id = req.query.id;
        let queryText = "SELECT * FROM PHOTOS WHERE photo_id in (SELECT photo_id FROM USER_PHOTO WHERE user_ID = $1 AND status = 'done') ORDER BY photo_id";
        let values = [id];
        db.param_query(queryText, values)
            .then(res => {
                getres.send(res.rows);
            })
            .catch(e => console.error(e.stack))
    });

    /**
     * Deletes the photo id passed in that belongs to that user
     * TODO: Remove from FS
     */
    app.post('/user/photos/delete', (req, getres) => {
        console.log("POST - delete photo");
		var requesterUserId = req.body.requesterUserId;
		stat.logStatRequest(requesterUserId);
        var photoId = req.body.photo_id;
        var userId = req.body.user_id;
        var queryText = "DELETE FROM user_photo WHERE photo_id = $1 AND user_id = $2;";
        console.log(queryText);
        async function deletePhoto() {
            var values = [photoId, userId];
            result = await db.param_query(queryText, values);
            queryText = "DELETE FROM photos WHERE photo_id = $1;";
            values = [photoId];
            console.log(queryText);
            result = await db.param_query(queryText, values);
            getres.send("Delete was a success!");
        }
        deletePhoto();
    });

    /**
     * Deletes the video id passed in that belongs to that user
     * TODO: Remove from FS
     */
    app.post('/user/videos/delete', (req, getres) => {
        console.log("POST - delete video");
		var requesterUserId = req.body.requesterUserId;
		stat.logStatRequest(requesterUserId);
        console.log(req.body);
        var videoId = req.body.video_id;
        var userId = req.body.user_id;
        var queryText = "DELETE FROM user_video WHERE video_id = $1 AND user_id = $2;";
        console.log(queryText);
        async function deleteVideo() {
            var values = [videoId, userId];
            result = await db.param_query(queryText, values);
            queryText = "DELETE FROM videos WHERE video_id = $1;";
            console.log(queryText);
            values = [videoId];
            result = await db.param_query(queryText, values);
            getres.send("Delete was a success!");
        }
        deleteVideo();
    });

    /**
     * Returns photos the user chooses to display on their profile
     */
    app.get('/user/photos/display', (req, getres) => {
        console.log("GET - user profile display photos");
		var requesterUserId = req.query.requesterUserId;
		stat.logStatRequest(requesterUserId);
        var id = req.query.id;
        let queryText = "SELECT * FROM PHOTOS WHERE photo_id in (SELECT photo_id FROM USER_PHOTO WHERE user_ID = $1 AND status = 'done') AND display = true;";
        let values = [id];
        db.param_query(queryText, values)
            .then(res => {
                getres.send(res.rows);
            })
            .catch(e => console.error(e.stack))
    });

    /**
     * Returns videos the user chooses to display on their profile
     */
    app.get('/user/videos/display', (req, getres) => {
        console.log("GET - user profile display videos");
		var requesterUserId = req.query.requesterUserId;
		stat.logStatRequest(requesterUserId);
        var id = req.query.id;
        let queryText = "SELECT * FROM VIDEOS WHERE video_id in (SELECT video_id FROM user_video WHERE user_ID = $1 AND status = 'done') AND display = true;";
        let values = [id];
        db.param_query(queryText, values)
            .then(res => {
                getres.send(res.rows);
            })
            .catch(e => console.error(e.stack))
    });

}