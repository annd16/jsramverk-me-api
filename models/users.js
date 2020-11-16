const sqlite3 = require('sqlite3').verbose();           // import node sqlite-module
const jwt = require('jsonwebtoken');
require('dotenv').config();
const bcrypt = require("bcryptjs");

const users = {

    getAll: function (res, data) {

        let db = new sqlite3.Database('../db/texts.sqlite');

        console.log("res.req.route = ");
        console.log(res.req.route);
        console.log("res.req.headers = ");
        console.log(res.req.headers);
        console.log("res.req.url = ");
        console.log(res.req.url);
        console.log("res.req.method = ");
        console.log(res.req.method);
        console.log("db = ");
        console.log(db);

        let sql = "SELECT * FROM users";

        db.all(
            sql,
            function (err, rows) {
                if (err) {
                    return res.status(500).json({
                        errors: [{
                            status: 500,
                            path: "/users",
                            title: "Database error",
                            message: err.message
                        }]
                    });
                }

                return res.status(200).json({
                    data2: {
                        msg: "Got a GET request to get all users, sending back default 200 OK",
                        status: 200,
                        rows: rows,
                        title: "SELECT command OK",
                        details: "Rows has successfully been SELECTED"
                    }
                });
            }
        );
    },


    getUser: function (res, data) {

        let db = new sqlite3.Database('../db/texts.sqlite');

        let sql = "SELECT * FROM users WHERE email = ?";

        console.log("data = ");
        console.log(data);

        console.log("data.email = ");
        console.log(data.email);

        db.get(
            sql,
            [data.email],
            (err, row) => {
                if (err) {
                    console.log("Something went wrong when trying to run a SELECT-statement!!");
                    // return console.log(err.message);
                    return res.status(500).json({
                        errors: [{
                            status: 500,
                            path: "/users/:id",
                            title: "Database error",
                            message: err.message
                        }]
                    });
                }

                var data2 = {
                    msg: "Got a GET request to get one user, sending back default 200 OK",
                    status: 200,
                    rows: row,
                    title: "SELECT command OK",
                    details: "One row has successfully been SELECTED"
                    }
                console.log("Closing DB connection.");
                db.close();
                // return row ? console.log(row) : console.log("No user with email address " + data.email + " was found!");
                return row ? res.status(200).json({data2: data2}) : console.log("No user with email address " + data.email + " was found!");
            }
                // return res.status(200).json({
                //     data: row
                // });
        );
    },


    register: function (res, data) {

        let db = new sqlite3.Database('../db/texts.sqlite');
        // const db = connection();
        console.log("res.req.route = ");
        console.log(res.req.route);
        console.log("res.req.headers = ");
        console.log(res.req.headers);
        console.log("res.req.url = ");
        console.log(res.req.url);
        console.log("res.req.method = ");
        console.log(res.req.method);
        console.log("db = ");
        console.log(db);
        console.log("data = ");
        console.log(data);


        function sanitizeOutput() {
            // function htmlEntities(str) {
            //     return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
            // }
        }
        // const myPlaintextPassword = 'longandhardP4$w0rD';
        const myPlaintextPassword = data.password;



        // Hash a password with the bcrypt module:
        const saltRounds = 10;

        bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
            // Spara lösenordet i databasen
            if (err) {
                console.log("err in bcrypt = ");
                console.log(err);
            }
            //Run prepared SQL statement
            if(db) {
                db.run("INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
                [data.name,
                    data.email,
                    hash
                ],
                (err, lastID) => {
                    if (err) {
                        // Returnera error
                        console.log("Something went wrong when trying to run an INSERT-statement!!");
                        // return console.log(err.message);
                        // return console.log(err.message);

                        // Return correct answer to the CLIENT
                        return res.status(500).json({
                            errors: [{
                                msg: "Got a POST request to add a new user, sending back 500 Internal Server Error",
                                status: 500,
                                path: "/register",
                                title: "Database error",
                                details: err.message
                            }]
                        });
                        // console.log("Closing DB connection.");
                        // db.close();
                    } else {
                        // Returnera korrekt svar
                        // get the last insert id
                        console.log(`A row has been inserted with rowid ${db.lastID}`);        // "this" is not defined in ES6 arrow functions!!
                        // return console.log(`A row has been inserted with rowid ${this.lastID}`);


                        // Return correct answer to the CLIENT
                        return res.status(201).json({
                            data2: {
                                msg: "Got a POST request to add a new user, sending back 201 Created",
                                id: data.id,
                                title: data.title,
                                content:  data.content,
                                status: 201,
                                title: "INSERT command OK",
                                details: "A row has successfully been INSERTED"
                            }
                        });
                        // // get the last insert id
                        // console.log(`A row with rowid ${this.lastID} has been updated.`);
                        // console.log("Closing DB connection.");
                        // db.close();
                    }
                })
                // This cannot happen BEFORE db transactions are completed!
                console.log("Closing DB connection.");
                db.close(() => {console.log("Database has now been closed!!!")});
            }
        });
    },

    login: function (res, data) {

        function checkUserAndPw(rows, data) {
            console.log("rows = ");
            console.log(rows);
            console.log("data = ");
            console.log(data);
            if(data.email === rows.email && data.password === rows.password) {
                console.log("User data seems to be OK!");
                return true;
            } else {
                console.log("User data comparison failed!");
                return false;
            }
        }

        function checkUser(rows, data) {
            console.log("rows = ");
            console.log(rows);
            console.log("data = ");
            console.log(data);
            if(data.email === rows.email) {
                console.log("User email seems to be OK!");
                return true;
            } else {
                console.log("User email comparison failed!");
                return false;
            }
        }


        function checkPw(user, data) {
            console.log("user = ");
            console.log(user);
            console.log("data = ");
            console.log(data);
            // Compare a saved password with the password a user has entered with the bcrypt module:
            // const hash = 'superlonghashedpasswordfetchedfromthedatabase';
            const hash = user.password;
            var plaintextPassword = data.password;

            bcrypt.compare(plaintextPassword, hash, function(err, result) {
                // res innehåller nu true eller false beroende på om det är rätt lösenord.
                if (result) {
                    console.log("Passwords are matching!!");
                    // Send a token from the server to the client
                    const payload = { email: data.email };
                    const secret = process.env.JWT_SECRET;

                    const token = jwt.sign(payload, secret, { expiresIn: '5min' });

                    // console.log("token = ");
                    // console.log(token);

                    return res.status(200).json({
                        data2: {
                            status: 200,
                            path: "/login",
                            title: "Authorization succeded",
                            detail: "Authorization succeded, user logged in",
                            rows: user,
                            token: token
                        }
                    });

                } else {
                    console.log("Sorry, the passwords are not matching!!");
                    return res.status(401).json({
                        errors: [{
                            msg: "Got a GET request to login a user, sending back 401 Unauthorized",
                            status: 401,
                            path: "/login",
                            title: "Email or password not matching",
                            details: "Email or password not matching"
                        }]
                    });
                }
                console.log("res in bcrypt.compare() = ");
                console.log(result);
                // return res;
            })
            // console.log("res in checkPw() = ");  // Unreachable code
            // console.log(res);
            // return res;
        }

        console.log("inside login!!!");
        console.log("data = ");
        console.log(data);

        // Check if username and password combination is in users table

        let db = new sqlite3.Database('../db/texts.sqlite');
        // const db = connection();
        console.log("db = ");
        console.log(db);
        //Run prepared SQL statement
        if(db) {
            db.get("SELECT * FROM users WHERE email = ?",
            [data.email],
            (err, rows) => {
                if (err) {
                    // Returnera error
                    console.log("Something went wrong when trying to run a SELECT-statement!!");
                    // return console.log(err.message);

                    return res.status(500).json({
                        errors: [{
                            msg: "Got a GET request to login a user, sending back 500 Internal Server Error",
                            status: 500,
                            path: "/login",
                            title: "Database error",
                            details: err.message
                        }]
                    });
                    // console.log("Closing DB connection.");
                    // db.close();
                } else {
                    // Returnera korrekt svar
                    // get the last insert id
                    // console.log(`A row has been selected ${this.lastID}`);
                    // return res.status(200).json({
                    //     data2: rows
                    // });
                    console.log("Closing DB connection.");
                    db.close();
                    if(rows !== undefined) {
                        console.log("rows = defined!");
                        if (!data.email || !data.password) {
                            return res.status(401).json({
                                errors: [{
                                    msg: "Got a GET request to login a user, sending back 401 Unauthorized",
                                    status: 401,
                                    path: "/login",
                                    title: "Email or password missing",
                                    details: "Email or password missing in request"
                                }]
                            });
                        }

                        const user = rows;

                        // console.log("checkPw() = ");
                        // console.log(checkPw(user, data));
                        // if (checkPw(user, data)) {
                        //     // res.redirect('/?valid=' + string);
                        //
                        //     // Send a token from the server to the client
                        //     const payload = { email: data.email };
                        //     const secret = process.env.JWT_SECRET;
                        //
                        //     const token = jwt.sign(payload, secret, { expiresIn: '5min' });
                        //
                        //     // console.log("token = ");
                        //     // console.log(token);
                        //
                        //     return res.status(200).json({
                        //         status: 200,
                        //         source: "/login",
                        //         title: "Authorization succeded",
                        //         detail: "Authorization succeded, user logged in",
                        //         rows: user,
                        //         token: token
                        //     });
                        //
                        //
                        // } else {
                        //     return res.status(401).json({
                        //         errors: {
                        //             status: 401,
                        //             source: "/login",
                        //             title: "Wrong email or password",
                        //             detail: "Wrong email or password in request"
                        //         }
                        //     });
                        // }
                        // checkPw(user, data);


                        console.log("user = ");
                        console.log(user);
                        console.log("data = ");
                        console.log(data);
                        // Compare a saved password with the password a user has entered with the bcrypt module:
                        // const hash = 'superlonghashedpasswordfetchedfromthedatabase';
                        const hash = user.password;
                        var plaintextPassword = data.password;

                        bcrypt.compare(plaintextPassword, hash, function(err, result) {
                            // res innehåller nu true eller false beroende på om det är rätt lösenord.
                            if (result) {
                                console.log("Passwords are matching!!");
                                // Send a token from the server to the client
                                const payload = { email: data.email };
                                const secret = process.env.JWT_SECRET;

                                const token = jwt.sign(payload, secret, { expiresIn: '5min' });

                                // console.log("token = ");
                                // console.log(token);

                                return res.status(200).json({
                                    data2: {
                                        status: 200,
                                        source: "/login",
                                        title: "Authorization succeded",
                                        details: "Authorization succeded, user logged in",
                                        rows: user,
                                        token: token
                                    }
                                });
                            } else {
                                console.log("Sorry, the passwords are not matching!!");
                            }
                            console.log("result in bcrypt.compare() = ");
                            console.log(result);
                            return res;
                        })
                    } else {
                        // rows is undefined
                        return res.status(401).json({
                            errors: [{
                                status: 401,
                                source: "/login",
                                title: "Unknown user",
                                details: "No user with provided email exists",
                                msg: "Unknow value",
                                param: "email"
                            }]
                        });
                    }
                    // return rows ? console.log("rows = " + rows) : console.log("No user with email address " + data.email + " was found!");
                }
            })




            // if(rows) {
            //     console.log("rows = defined!");
            //     if (checkUserAndPw(rows, data)) {
            //         // Send a token from the server to the client
            //         const payload = { email: data.email };
            //         const secret = process.env.JWT_SECRET;
            //
            //         const token = jwt.sign(payload, secret, { expiresIn: '1h' });
            //
            //         console.log("token = ");
            //         console.log(token);
            //     }
            // }

        }




        console.log("res.req.route = ");
        console.log(res.req.route);
        console.log("res.req.headers = ");
        console.log(res.req.headers);
        console.log("res.req.url = ");
        console.log(res.req.url);
        console.log("res.req.method = ");
        console.log(res.req.method);
        console.log("data = ");
        console.log(data);
    },

    logout: function (res, data) {
        console.log("users.logout!!");
    },


    // checkToken: function (req, res, next) {
    checkToken: function (req, res, next) {

        console.log("inside checkToken!!!");

        // console.log("res.req = ");
        // console.log(res.req);
        console.log("res.req._startTime = ");
        console.log(res.req._startTime);
        console.log("res.req.route = ");
        console.log(res.req.route);
        console.log("res.req.headers = ");
        console.log(res.req.headers);
        console.log("res.req.url = ");
        console.log(res.req.url);
        console.log("res.req.method = ");
        console.log(res.req.method);

        console.log("res.req.body = ");
        console.log(res.req.body);
        console.log("res.req.statusCode = ");
        console.log(res.req.statusCode);
        console.log("res.req.statusMessage = ");
        console.log(res.req.statusMessage);



        // var token = req.headers['x-access-token'];
        var token = req.headers['x-access-token'];
        console.log("token = ");
        console.log(token);
        const secret = process.env.JWT_SECRET;

        if (token) {
            jwt.verify(token, secret, function(err, decoded) {
                if (err) {
                    return res.status(500).json({
                        errors: [{
                            status: 500,
                            source: req.path,
                            title: "Failed authentication",
                            details: err.message
                        }]
                    });
                }

                req.user = {};
                // req.user.api_key = decoded.api_key;
                req.user.email = decoded.email;

                next();

                return undefined;
            });
        } else {
            return res.status(401).json({
                errors: [{
                    status: 401,
                    source: req.path,
                    title: "No token",
                    details: "No token provided in request headers"
                }]
            });
        }
    }
};

module.exports = users;
