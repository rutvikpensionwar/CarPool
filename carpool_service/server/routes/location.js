require('dotenv').config();
require('winston-mongodb');
var express = require('express');
var winston = require('winston');
var moment = require('moment');
var router = express.Router();

// additional dependencies
var mysql = require('mysql');
var connection = mysql.createConnection({
    host     : process.env.host,
    user     : process.env.user,
    password : process.env.password,
    database : process.env.database,
    multipleStatements: true
});

// Check to see if connection was successful
connection.connect(function(err) {
    if (err) {
        console.error('Error connecting to DB: ' + err.stack);
        return;
    }

    console.log('Connection successful (thread id ' + connection.threadId + ')');
});

const logger = winston.createLogger({
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: '../../LOG/server.log' }),
        new winston.transports.MongoDB(
            {
                db: 'mongodb://localhost:27017/logger',
                collection: 'logs',
                storeHost: true
            })
    ]
});

function log(level, message) {
    var now = moment();
    var formatted = now.format('YYYY-MM-DD HH:mm:ss Z');

    logger.log({
        timestamp: formatted,
        level: level,
        message: message
    });
}

// Get location for id
router.get('/:id', function(req, res) {

    var sql = "SELECT * FROM location WHERE `location`.location_id = " + req.params.id;
    log('info', "Executing query: " + sql);

    connection.query(sql, function (error, results) {
        if (error) throw error;
        log('info', "GET specific location using location id: ", results);
        res.status(200).send(results);
    });
});

// Get location
router.get('/', function(req, res) {

    var sql = "SELECT * FROM location";
    log('info', "Executing query: " + sql);

    connection.query(sql, function (error, results) {
        if (error) throw error;
        log('info', "GET all locations ", results);
        res.status(200).send(results);
    });
});

// Add location
router.post('/add', function(req, res) {
    // Find the largest location_id
    var max_id;
    connection.query("SELECT MAX(location_id) from location", function(error, results) {
        if (error) throw error;
        max_id = results[0]['MAX(location_id)'];
        log('info', "Get max location_id:" + max_id);

        connection.query(`INSERT INTO location VALUES (${max_id + 1}, '${req.body.street_name}', '${req.body.city}', '${req.body.state}', '${req.body.country}')`,
            function(error, results) {
                if (error) throw error;
                console.log('results', results);
            }
        );

        res.send();
    });
});

// Update the location details
router.post('/update/:id', function (req, res) {

    var email = null;
    var location_id = req.params.id;
    var street_name = req.body.street_name;
    var city = req.body.city;
    var state = req.body.state;
    var country = req.body.country;
    var sql = null;

    if(req.session.user) {
        email = req.session.user.email;
    }

    if (email === (JSON.parse(process.env.admin)).email) {
        sql = "UPDATE location SET" +
              " street_name = ?," +
              " city = ?," +
              " state = ?," +
              " country = ?" +
              " WHERE location_id = ?";
        var inserts = [street_name, city, state, country, location_id];
        log('info', "Executing query:  " + mysql.format(sql, inserts));

        connection.query(mysql.format(sql, inserts), function (error, results) {
            if (error) throw error;
            log('info', "Update the location  " + results);
            if(results.affectedRows === 1) {
                res.status(200).send("Location updated successfully.");
            }
            else {
                res.status(400).send("Update location unsuccessful.");
            }
        });
    }
    else {
        res.status(401).send("Logged in user doesn't have access to this feature.");
    }
});

// Delete a location
router.post('/delete/:id', function (req, res) {
    var email = null;
    var location_id = req.params.id;
    var sql = null;

    if(req.session.user) {
        email = req.session.user.email;
    }

    if (email === (JSON.parse(process.env.admin)).email) {
        sql = "DELETE FROM location WHERE location_id = ?";
        var inserts = [location_id];
        log('info', "Executing query:  " + mysql.format(sql, inserts));

        connection.query(mysql.format(sql, inserts), function (error, results) {
            if (error) throw error;
            log('info', "Delete the location  " + results);
            if(results.affectedRows === 1) {
                res.status(200).send("Location delete successfully.");
            }
            else {
                res.status(400).send("Delete location unsuccessful.");
            }

        });
    }
    else {
        res.status(401).send("Logged in user doesn't have access to this feature.");
    }
});

module.exports = router;
