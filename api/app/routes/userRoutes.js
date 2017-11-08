const db = require('../db');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const config = require('../../config.js');

// const uploadsPath = '/images/uploads/';
// const uploadsPath = '/home/administrator/files/images/uploads/';
// const uploadsPath = 'C:/Users/KaiWong/';

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
        var queryText = "SELECT * FROM ASP_USERS WHERE email = '" + email + "';";
        console.log(queryText);
        db.query(queryText)
            .then(res => {
                if (res == undefined) {
                    getres.send("Create account failed");
                } else if (res.rowCount > 0) {
                    console.log("Email already registered to account");
                    getres.send("Email already registered to account");
                } else {
                    // Email is unique
                    console.log("Email is unique");
                    let queryText = "INSERT INTO asp_users (first_name, last_name, email, password, date_joined, status) VALUES ('" + firstName + "', '" + lastName + "', '" + email + "', '" + password + "', '" + date + "', true);";
                    console.log("Query: " + queryText);
                    db.query(queryText)
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
        var queryText = "SELECT * FROM ASP_USERS WHERE email = '" + email + "';";
        console.log(queryText);
        db.query(queryText)
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
                        queryText = "UPDATE asp_users SET (first_name, last_name, email, password) = ('" + firstName + "', '" + lastName + "', '" + email + "', '" + password + "') WHERE user_id = " + id + ";";
                    }
                    console.log("Query: " + queryText);
                    db.query(queryText)
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
        let queryText = "SELECT * FROM asp_users WHERE email = '" + email + "' AND password = '" + password + "';";
        db.query(queryText)
            .then(res => {
                if (res.rows[0] != null) {
                    // Puts various user information into the JWT
                    var payload = {
                        user_id: res.rows[0].user_id,
                        first_name: res.rows[0].first_name,
                        last_name: res.rows[0].last_name,
                        isAdmin: res.rows[0].admin,
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
        var searchString = req.query.searchString;
        let queryText = "SELECT * FROM ASP_USERS WHERE first_name::text || last_name::text LIKE '%" + searchString + "%'";
        db.query(queryText)
            .then(res => {
                console.log(res.rows);
                getres.send(res.rows);
            })
            .catch(e => console.error(e.stack))
    });

    /**
     * Returns user info for user with id
     * Takes in the request query's parameters
     */
    app.get('/user/info', (req, getres) => {
        console.log("GET - info");
        var id = req.query.id;
        let queryText = "SELECT * FROM ASP_USERS WHERE user_ID = " + id + ";";
        db.query(queryText)
            .then(res => {
                console.log(res.rows);
                getres.send(res.rows);
            })
            .catch(e => console.error(e.stack))
    });

    /**
     * Return user that matches passed email (used for account creation verification)
     * Takes in the request query's parameters
     */
    // todo: DELETE!
    app.get('/user/email/info', (req, getres) => {
        console.log("GET - info");
        var email = req.query.email;
        let queryText = "SELECT * FROM ASP_USERS WHERE email = '" + email + "';";
        console.log(queryText);
        db.query(queryText)
            .then(res => {
                console.log(res.rows);
                getres.send(res.rows);
            })
            .catch(e => console.error(e.stack))
    });

    /**
     * Returns user profile picture for user with id
     * Takes in the request query's parameters
     */
    // todo: DELETE!
    app.get('/user/profile-picture', (req, getres) => {
        console.log("GET - profile picture");
        var id = req.query.id;
        let queryText = "SELECT profile_photo FROM asp_users WHERE user_id = " + id + ";";
        db.query(queryText)
            .then(res => {
                console.log(res.rows);
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
      var id = req.query.id;
      let queryText = "SELECT * FROM unfiltered_photo WHERE unfiltered_photo_id IN (SELECT unfiltered_photo_id FROM USER_PHOTO WHERE user_ID = " + id + " AND (status = 'waiting' OR status = 'processing'))";
      db.query(queryText)
          .then(res => {
              console.log(res.rows);
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
        var id = req.query.id;
        let queryText = "SELECT * FROM unfiltered_video WHERE unfiltered_video_id IN (SELECT unfiltered_video_id FROM user_video WHERE user_ID = " + id + " AND (status = 'waiting' OR status = 'processing'))";
        db.query(queryText)
            .then(res => {
                console.log(res.rows);
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
        var id = req.body.id;
        var queryText = "SELECT * FROM Paid_Users WHERE user_id = '" + id + "';";
        db.query(queryText)
            .then(res => {
                if (res == undefined) {
                    getres.send("Paid user creation failed");
                }
                if (res.rowCount === 0) {
                    queryText = "INSERT INTO Paid_Users (user_ID) VALUES ('" + id + "');";
                    db.query(queryText).then(res => {
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
        var id = req.body.photo_id;
        var display = req.body.display;
        var queryText = "UPDATE PHOTOS SET display = " + req.body.display + " WHERE photo_id = " + id + ";";
        console.log(queryText);
        db.query(queryText)
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
        var id = req.body.video_id;
        var display = req.body.display;
        var queryText = "UPDATE VIDEOS SET display = " + req.body.display + " WHERE video_id = " + id + ";";
        console.log(queryText);
        db.query(queryText)
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
        var id = req.query.id;
        let queryText = "SELECT * FROM VIDEOS WHERE video_id IN (SELECT video_id FROM USER_VIDEO WHERE user_ID = " + id + " AND status = 'done')";
        db.query(queryText)
            .then(res => {
                console.log(res.rows);
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
        var id = req.query.id;
        let queryText = "SELECT * FROM PHOTOS WHERE photo_id in (SELECT photo_id FROM USER_PHOTO WHERE user_ID = " + id + " AND status = 'done')";
        db.query(queryText)
            .then(res => {
                console.log(res.rows);
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
        console.log(req.body);
        let queryText = "DELETE FROM user_photo WHERE photo_id = " + req.body.photo_id + " AND user_id = " + req.body.user_id + ";";
        console.log(queryText);
        async function deletePhoto() {
            result = await db.query(queryText);
            queryText = "DELETE FROM photos WHERE photo_id = " + req.body.photo_id + ";";
            console.log(queryText);
            result = await db.query(queryText);
            getres.send("Delete was a success!");
        }
        deletePhoto();
        // db.query(queryText)
        //   .then(res => {
        //     // console.log(res.rows);
        //     // getres.send(res.rows);
        //     queryText = "DELETE FROM photos WHERE photo_id = " + req.body.photo_id + ";";
        //     console.log(queryText);
        //     db.query(queryText).then(res => {
        //         getres.send("Delete was a success");
        //     })
        //   })
        //   .catch(e => console.error(e.stack))
    });

    /**
     * Deletes the video id passed in that belongs to that user
     * TODO: Remove from FS
     */
    app.post('/user/videos/delete', (req, getres) => {
        console.log("POST - delete video");
        console.log(req.body);
        let queryText = "DELETE FROM user_video WHERE video_id = " + req.body.video_id + " AND user_id = " + req.body.user_id + ";";
        console.log(queryText);
        async function deleteVideo() {
            result = await db.query(queryText);
            queryText = "DELETE FROM videos WHERE video_id = " + req.body.video_id + ";";
            console.log(queryText);
            result = await db.query(queryText);
            getres.send("Delete was a success!");
        }
        deleteVideo();
        // db.query(queryText)
        //   .then(res => {
        //     // console.log(res.rows);
        //     // getres.send(res.rows);
        //     queryText = "DELETE FROM photos WHERE photo_id = " + req.body.photo_id + ";";
        //     console.log(queryText);
        //     db.query(queryText).then(res => {
        //         getres.send("Delete was a success");
        //     })
        //   })
        //   .catch(e => console.error(e.stack))
    });

    /**
     * Returns photos the user chooses to display on their profile
     */
    app.get('/user/photos/display', (req, getres) => {
        console.log("GET - user profile display photos");
        var id = req.query.id;
        let queryText = "SELECT * FROM PHOTOS WHERE photo_id in (SELECT photo_id FROM USER_PHOTO WHERE user_ID = " + id + " AND status = 'done') AND display = true;";
        db.query(queryText)
            .then(res => {
                console.log(res.rows);
                getres.send(res.rows);
            })
            .catch(e => console.error(e.stack))
    });

    /**
     * Returns videos the user chooses to display on their profile
     */
    app.get('/user/videos/display', (req, getres) => {
        console.log("GET - user profile display videos");
        var id = req.query.id;
        let queryText = "SELECT * FROM VIDEOS WHERE video_id in (SELECT video_id FROM user_video WHERE user_ID = " + id + " AND status = 'done') AND display = true;";
        db.query(queryText)
            .then(res => {
                console.log(res.rows);
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
        var id = req.body.id;
        var queryText = "SELECT * FROM Paid_Users WHERE user_id = '" + id + "';";
        db.query(queryText)
            .then(res => {
                if (res == undefined) {
                    getres.send("Paid user creation failed");
                }
                if (res.rowCount === 0) {
                    queryText = "INSERT INTO Paid_Users (user_ID) VALUES ('" + id + "');";
                    db.query(queryText).then(res => {
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
}
