const express = require('express');

// const morgan = require('morgan');
// const cors = require('cors');
// const bodyParser = require("body-parser");

// Use the express.Router class to create modular, mountable route handlers.
// A Router instance is a complete middleware and routing system; for this reason,
// it is often referred to as a “mini-app”.
const router = express.Router();

const reports = require("../models/reports.js");

// router.get('/', (req, res) => users.getAll(res, req.query.api_key));
// router.get('/week/:id', (req, res) => users.getUser()
//     res,
//     req.query.api_key,
//     req.params.id
// ));

// Add a route that gets the id:s of the existing reports and sends an answer in json format
router.get("/", (req, res) => {

    // Define a json object
    const data = {
            msg: "Got a GET request to get the id:s of the kmoms, sending back default 200",
            // id: req.params.id,
            // title: req.param.title,
    };
    console.log("Inside route GET /dbreport2 in me-api!!");
    // res.status(200).send(data);
    console.log("Inside route GET /dbreports in me-api AFTER data has been sent!!");
    reports.getIds(res, data);
});

// Add a route that get one report to be displayed and sends an answer in json format
router.get("/week/:id", (req, res) => {
    // Define a json object
    const data = {
            msg: "Got a GET request to get one report to be displayed (READ-ONLY), sending back default 200",
            id: req.params.id,
            // title: req.param.title,
    };
    console.log("Inside route GET /dbreport/:id in me-api!!");
    // res.status(200).send(data);
    console.log("Inside route GET /dbreport/:id in me-api AFTER data has been sent!!");
    reports.get(res, data);
});

// Add a route that updates a report text and sends an answer in json format
router.put("/", (req, res) => {
    // Define a json object
    const data = {
            msg: "Got a PUT request to update a report, sending back 201 Created",
            id: req.body.id,
            title: req.body.title,
            content:  req.body.content
    };
    console.log("Inside route PUT /dbreports in me-api!!");
    // res.status(201).send(data);
    console.log("Inside route PUT /dbreports in me-api AFTER data has been sent!!");
    reports.edit(res, data);
});



// Add a route that creates a new report and sends an answer in json format
router.post("/",
    // First function to run
    (req, res, next) => {
        // Define a json object
        // const data = {
        //         msg: "Got a POST request to create a report, sending back 201 Created",
        //         id: req.body.id,
        //         title: req.body.title,
        //         content:  req.body.content
        // };

        console.log("Inside route POST /dbreports in me-api!!");
        // res.status(201).send(data);
        console.log("Inside route POST /dbreports in me-api AFTER data has been sent!!");
        // console.log("Inside route /dbreports2 in me-api AFTER data has been sent!!");
        next();
    },
    // Second function to run
    (req, res, next) => users.checkToken(req, res, next),
    // Third function to run...
    (req, res) => reports.add(res, req.body)

        // (req, res, next) => users.checkToken(req, res, next),
        // (req, res) => reports.add(res, req.body);

        // middleware function!
        // I express finns termen “middleware” som benämning på callbacks som anropas innan själva routens hanterare anropas.
        // En middleware kan också vara en hanterare som alltid anropas för alla routes.
        // checkToken(req, res, next),
        // (req, res) => reports.addReport(res, reqBody)
    // });
);


// Add a route that creates a new report and sends an answer in json format
router.delete("/",
    // First function to run
    (req, res, next) => {
        // Define a json object
        const data = {
                msg: "Got a DELETE request to delete a report, sending back 202 for Accepted",
                id: req.body.id,
                title: req.body.title,
                content:  req.body.content
        };

        console.log("Inside route POST /dbreports in me-api!!");
        // res.status(201).send(data);
        console.log("Inside route POST /dbreports in me-api AFTER data has been sent!!");
        // console.log("Inside route /dbreports2 in me-api AFTER data has been sent!!");
        next();
    },
    // Second function to run
    (req, res, next) => users.checkToken(req, res, next),
    // Third function to run...
    (req, res) => reports.delete(res, req.body)

        // (req, res, next) => users.checkToken(req, res, next),
        // (req, res) => reports.add(res, req.body);

        // middleware function!
        // I express finns termen “middleware” som benämning på callbacks som anropas innan själva routens hanterare anropas.
        // En middleware kan också vara en hanterare som alltid anropas för alla routes.
        // checkToken(req, res, next),
        // (req, res) => reports.addReport(res, reqBody)
    // });
);

module.exports = router;
