const sqlite3 = require('sqlite3').verbose();           // import node sqlite-module
// const db = new sqlite3.Database('./db/texts.sqlite');

const connection = require('../miscellaneous/connection');

const reports = {
    getIds: function (res, data) {

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
        console.log("res.req.signal = ");
        console.log(res.req.signal);
        console.log("db = ");
        console.log(db);
        console.log("data = ");
        console.log(data);

        //Run prepared SQL statement
        if(db) {

            let sql = "SELECT id FROM reports;"
            db.all(
                sql,
                [],
                function (err, rows) {
                    console.log("rows = ");
                    console.log(rows);
                    if (err) {
                        return res.status(500).json({
                            error: {
                                status: 500,
                                path: "/dbreports",
                                method: "GET",
                                title: "Database error",
                                message: err.message
                            }
                        });
                    }
                    rows.forEach((row) => {
                        console.log("row.name = ");
                        console.log(row.name);
                    });
                    return res.status(200).json({
                        data: rows
                    });
                }
            );
            console.log("Closing DB connection.");
            db.close();
        }
    },

    get: function (res, data) {

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
        console.log("res.req.signal = ");
        console.log(res.req.signal);
        console.log("db = ");
        console.log(db);
        console.log("data = ");
        console.log(data);

        //Run prepared SQL statement
        if(db) {

            let sql = "SELECT * FROM reports WHERE id = ?;"
            db.all(
                sql,
                [data.id],
                function (err, rows) {
                    console.log("rows in reports.get = ");
                    console.log(rows);
                    if (err) {
                        return res.status(500).json({
                            error: {
                                status: 500,
                                path: "/dbreports/week/:id)",
                                method: "GET",
                                title: "Database error",
                                message: err.message
                            }
                        });
                    }
                    rows.forEach((row) => {
                        console.log("row.name = ");
                        console.log(row.name);
                    });
                    return res.status(200).json({
                        data: rows
                    });
                }
            );
            console.log("Closing DB connection.");
            db.close();
        }
    },

    add: function (res, data) {

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
        console.log(data);              // The stringified state of the report form

        //Run prepared SQL statement
        if(db) {
            db.run("INSERT INTO reports (id, title, content) VALUES (?, ?, ?)",
            [data.id,
                data.title,
                data.content
            ],
            (err) => {
                if (err) {
                    // console.log("Closing DB connection.");
                    // db.close();
                    // Returnera error
                    console.log("Something went wrong when trying to run an INSERT-statement!!");
                    return console.log(err.message);
                } else {
                    // Return correct answer to the CLIENT
                    return res.status(201).json({
                        data2: {
                            msg: "Got a POST request to create a report, sending back 201 Created",
                            id: data.id,
                            title: data.title,
                            content:  data.content,
                            status: 201,
                            title: "INSERT command OK",
                            details: "A row has successfully been INSERTED"
                        }
                    });
                    // get the last insert id
                    console.log(`A row has been inserted with rowid ${this.lastID}`);
                }
            })
            console.log("Closing DB connection.");
            db.close();
        }
    },
    edit: function (res, data) {

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

        //Run prepared SQL statement
        if(db) {
            db.run("UPDATE reports SET title = ?, content = ? WHERE id = ?",
            [ data.title,
                data.content,
                data.id
            ],
            (err) => {
                if (err) {
                    // Returnera error
                    console.log("Something went wrong when trying to run an UPDATE-statement!!");
                    return console.log(err.message);
                } else {
                    // Return correct answer to the CLIENT
                    return res.status(201).json({
                        data2: {
                            msg: "Got a PUT request to edit a report, sending back 200 OK",
                            id: data.id,
                            title: data.title,
                            content:  data.content,
                            status: 200,
                            title: "UPDATE command OK",
                            details: "A row has successfully been UPDATED"
                        }
                    });
                    // get the last insert id
                    console.log(`A row with rowid ${this.lastID} has been updated.`);
                }
            })
            console.log("Closing DB connection.");
            db.close();
        }
    },
    delete: function (res, data) {

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

        //Run prepared SQL statement
        if(db) {
            db.run("DELETE FROM reports WHERE id=? LIMIT 1",
            [data.id],
            (err) => {
                if (err) {
                    // Returnera error
                    console.log("Something went wrong when trying to run a DELETE-statement!!");
                    return console.log(err.message);
                } else {
                    // Return correct answer to the CLIENT
                    return res.status(204).json({
                        data2: {
                            msg: "Got a DELETE request to delete a report, sending back 204 No Content",
                            id: data.id,
                            title: data.title,
                            content:  data.content,
                            status: 204,
                            title: "DELETE command OK",
                            details: "A row has successfully been DELETED  "
                        }
                    });
                    // get the last insert id
                    console.log(`A row with rowid ${this.lastID} had been deleted from reports table.`);
                }
            })
            console.log("Closing DB connection.");
            db.close();
        }
    }
}

module.exports = reports;
