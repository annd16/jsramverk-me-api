const express = require("express");
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require("body-parser");

const index = require('./routes/index');
const hello = require('./routes/hello');

const dbreports = require('./routes/dbreports');
const users = require('./routes/users');

const app = express();

const reports = require('./models/reports');
// const create = require('./miscellaneous/add_user');
// const login = require('./miscellaneous/login_user');



var cookieParser = require('cookie-parser');

// var pw_handling = require('./miscellaneous/pw_handling');

// Using body-parser (a Node.js body parsing middleware) to be able to use parameters in POST/PUT/DELETE requests
// Middleware = callbacks that is called before your route handlers

const port = 1337;

// // Use "self-defined routes";
// app.use("/", index);
// app.use('/hello', hello);



// Allow clients from other domains
app.use(cors());

// Don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined'));        // 'combined' outputs the Apache style LOGs
}

// Add a route
// app.get("/", (req, res) => {
//     res.send("Hello World");
// });

// Body parsing by the middleware method "use":
app.use(bodyParser.json());      // for parsing application/json
app.use(bodyParser.urlencoded({extended: true}));   // for parsing application/x-www-form-urlencoded


app.use(cookieParser());

// This is middleware called for all routes, it prints out (on the server side) which route that was accessed with which method
// Middleware takes three parameters.
// This code needs to be placed before all other code if it always should be used.
app.use((req, res, next) => {
    console.log(req.method);
    console.log(req.path);
    next(); // Transfers the control to the next middleware function, or if this is the last one, the route handler
});


app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    res.status(err.status || 500).json({
        "errors": [
            {
                "status": err.status,
                "title": err.message,
                "detail": err.message
            }
        ]
    });
    next(); // Transfers the control to the next middleware function, or if this is the last one, the route handler
});

// app.use((req, res, next) => {
//     var err = new Error("Not Found");
//     err.status = 404;
//     next(err); // First use the built-in errorhandler, then transfers the control to the next middleware function, or if this is the last one, the route handler
// });

// Add a route that sends an answer in json format
app.get("/", (req, res) => {
    console.log("Inside GET /-route")
    // Cookies that have not been signed
  console.log('Cookies: ', req.cookies)

  // Cookies that have been signed
  console.log('Signed Cookies: ', req.signedCookies)
    // Define a json object
    const data = {
        data: {
            msg: "Hello World"
        }
    };
    res.json(data);
});

app.use('/dbreports', dbreports);
app.use('/', users);

// Start up a server
app.listen(port, () => console.log(`Example API listening on port ${port}!`));
