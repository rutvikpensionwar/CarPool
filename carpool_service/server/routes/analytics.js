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

    log("info", "Connection to DB successful (thread id " + connection.threadId + ")");
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


// Get rider matched:unmatched ratio (TODAY)
router.get('/today', function(req, res) {

    var email = null;
    var sql = null;

    if(req.session.user) {
        email = req.session.user.email;
    }

    if (email === (JSON.parse(process.env.admin)).email) {
        sql = "CALL rider_matching_ratio_today(@match, @unmatch)";

        connection.query(sql, function (error, results) {
            if (error) throw error;
            log('info', "Get rider matched:unmatched ratio (TODAY) " + results);
            res.status(200).send(results);
        });
    }
    else {
        res.status(401).send("Logged in user doesn't have access to this feature.");
    }
});

// Get rider matched:unmatched ratio (ALL)
router.get('/all', function(req, res) {

    var email = null;
    var sql = null;

    if(req.session.user) {
        email = req.session.user.email;
    }

    if (email === (JSON.parse(process.env.admin)).email) {
        sql = "CALL rider_matching_ratio_all(@match, @unmatch)";

        connection.query(sql, function (error, results) {
            if (error) throw error;
            log('info', "Get rider matched:unmatched ratio (ALL) " + results);
            res.status(200).send(results);
        });
    }
    else {
        res.status(401).send("Logged in user doesn't have access to this feature.");
    }
});

module.exports = router;