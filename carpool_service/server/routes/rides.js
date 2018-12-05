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

// GET logged in user's rides (TODAY)
router.get('/today', function(req, res) {

    var email = req.session.user.email;
    var sql = null;
    var inserts = null;

    if (email === (JSON.parse(process.env.admin)).email) {
        sql = "SELECT * FROM `ride` JOIN `rided` ON `ride`.ride_id = `rided`.ride_id" +
              " WHERE DATE(`ride`.journey_start_time) = ?";
        inserts = [email, mysql.raw('CURDATE()')];
    }
    else {
        sql = "SELECT * FROM `ride` JOIN `rided` ON `ride`.ride_id = `rided`.ride_id" +
              " WHERE `rided`.email = ?" +
              " AND DATE(`ride`.journey_start_time) = ?";
        inserts = [email, mysql.raw('CURDATE()')];
    }

    log('info', "Executing query:  " + mysql.format(sql, inserts));

    connection.query(mysql.format(sql, inserts), function (error, results) {
        if (error) throw error;
        log('info', "GET logged in user's rides (TODAY):  " + results);
        res.status(200).send(results);
    });

});

// GET logged in user's all rides (HISTORY)
router.get('/history', function(req, res) {

    var email = req.session.user.email;
    var sql = null;
    var inserts = null;

    if (email === (JSON.parse(process.env.admin)).email) {
        sql = "SELECT * FROM `ride` JOIN `rided` ON `ride`.ride_id = `rided`.ride_id" +
              " WHERE DATE(`ride`.journey_start_time) < ?";
        inserts = [mysql.raw('CURDATE()')];
    }
    else {
        sql = "SELECT * FROM `ride` JOIN `rided` ON `ride`.ride_id = `rided`.ride_id" +
              " WHERE `rided`.email = ?" +
              " AND DATE(`ride`.journey_start_time) < ?";
        inserts = [email, mysql.raw('CURDATE()')];
    }

    log('info', "Executing query:  " + mysql.format(sql, inserts));

    connection.query(mysql.format(sql, inserts), function (error, results) {
        if (error) throw error;
        log('info', "GET logged in user's all rides (HISTORY):  " + results);
        res.send(results);
    });

});

// GET logged in user's specific ride
router.get('/:ride_id', function(req, res) {

    var email = req.session.user.email;
    var ride_id = req.params.ride_id;
    var sql = null;
    var inserts = null;

    if (email === (JSON.parse(process.env.admin)).email) {
        sql = "SELECT * FROM `ride` JOIN `rided` ON `ride`.ride_id = `rided`.ride_id" +
              " WHERE `rided`.ride_id = ?";
        inserts = [email, ride_id];
    }
    else {
        sql = "SELECT * FROM `ride` JOIN `rided` ON `ride`.ride_id = `rided`.ride_id" +
            " WHERE `rided`.email = ?" +
            " AND `rided`.ride_id = ?";
        inserts = [email, ride_id];
    }

    log('info', "Executing query:  " + mysql.format(sql, inserts));

    connection.query(mysql.format(sql, inserts), function (error, results) {
        if (error) throw error;
        log('info', "GET logged in user's specific ride:  " + results);

        res.send(results);
    });

});

module.exports = router;