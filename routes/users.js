const express = require('express');
const router = express.Router();

const { body, validationResult } = require('express-validator');


const users = require("../models/users.js");

// Add a route that fetches all users from database and return in json format
router.post("/users", (req, res) => {
    // Define a json object
    const data = {
        data: {
            msg: "Got a GET request to list all users, sending back default 200",
            // name: req.body.name,
            // epost: req.body.epost,
            // password:  req.body.password
        }
    };
    console.log("Inside route /users in me-api!!");
    // res.status(200).send(data);      // Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client
    console.log("Inside route /users in me-api AFTER data has been sent!!");
    users.getAll(res, data);
});


// Add a route that fetches one  user from database and return in json format
router.post("/user", (req, res) => {
    // Define a json object
    const data = {
            msg: "Got a POST request to list a particular user, sending back default 200",
            // name: req.body.name,
            email: req.body.email,
            // password:  req.body.password
    };
    console.log("Inside route /user in me-api!!");
    // res.status(200).send(data);      // Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client
    console.log("Inside route /user in me-api AFTER data has been sent!!");
    users.getUser(res, data);
});


// router.get('/', (req, res) => users.getAll(res, req.query.api_key));
// router.get('/:id', (req, res) => users.getUser()
//     res,
//     req.query.api_key,
//     req.params.id
// ));


// Add a route that creates a new user and sends an answer in json format
router.post("/register",

    [
        // Validation with express-validator

        // Email must be an email
        body('email').isEmail(),
        // Password must be at least 3 chars long and no more than 128 chars
        body('password').isLength({ min: 3, max: 128 }),
        // Date must have a valid format
        body('selectedDate2').isDate({ format: "2003-10-11", strictMode: true, delimiters: ["-"] }),
        // Date must be TODAY or earlier in time:
        // var now = new Date();
        // var tomorrow;
        // tomorrow.setDate(nowDate.getDate() + 1);
        // var tomorrowString = tomorrow.toDateString();
        body('selectedDate2').isBefore(
            new Date(new Date().setDate(new Date().getDate() + 1)).toDateString()
        ).isAfter(
            new Date(new Date().setFullYear(new Date().getFullYear() - 125)).toDateString()
        )
    ],

    (req, res) => {

    // Define a json object
    const data = {
            msg: "Got a POST request to add a new user, sending back 201 Created",
            name: req.body.name,
            email: req.body.email,
            password:  req.body.password,
            date: req.body.date,
            selectedDate: req.body.selectedDate,
            selectedDate2: req.body.selectedDate2
    };
    console.log("Inside route /register in me-api!!");

    // Find the validation errors in this request and wrap them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log("Validation failed!!");
        return res.status(400).json({ data: data, errors: errors.array() });
    } else {
        // res.status(201).send(data);
        console.log("Inside route /register in me-api Before users.register is called!!");
        users.register(res, data);
    }

});


router.post("/login",

    [
        // Validation with express-validator

        // Email must be an email
        body('email').isEmail(),
        // Password must be at least 3 chars long and no more than 128 chars
        body('password').isLength({ min: 3, max: 128 })
    ],
    (req, res) => {
        // Define a json object
        const data = {
                msg: "Got a POST request to login a user, sending back default 200",
                email: req.body.email,
                password:  req.body.password
        };
        console.log("Inside route /login in me-api!!");

        // Find the validation errors in this request and wrap them in an object with handy functions
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log("Validation failed!!");
            return res.status(400).json({ data: data, errors: errors.array() });
        } else {
            // res.status(200).send(data);
            console.log("Inside route /register in me-api Before users.login is called!!");
            users.login(res, data);
        }
    });

router.post("/logout", (req, res) => {
    // Define a json object
    const data = {
            msg: "Got a POST request to logout a user, sending back default 200",
            email: req.body.email,
            // password:  req.body.password
    };
    console.log("Inside route /logout in me-api!!");
    // res.status(200).send(data);
    console.log("Inside route /logout in me-api AFTER data has been sent!!");
    users.logout(res, data);
    // console.log("data2 = ");
    // console.log(data2);
});

module.exports = router;
