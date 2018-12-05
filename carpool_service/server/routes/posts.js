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

// POST request to add a new post by driver/rider
router.post('/add', function (req, res) {

    var email = req.session.user.email;
    var post_type = req.body.post_type;
    var window_start_time = req.body.window_start_time;
    var window_end_time = req.body.window_end_time;
    var source_id = req.body.source_id;
    var destination_id = req.body.destination_id;

    var sql = "INSERT INTO `post`(email, post_type, window_start_time, window_end_time, source_id, destination_id)" +
              " VALUES(?, ?, ?, ?, ?, ?)";

    var inserts = [email, post_type, window_start_time, window_end_time, source_id, destination_id];

    log('info', "Executing query:  " + mysql.format(sql, inserts));

    connection.query(mysql.format(sql, inserts), function (error, results) {
        if(error) throw error;
        log('info', "POST request to add a new post by driver/rider");
        if(results.affectedRows === 1) {
            res.status(201).send((results.insertId).toString());
        }
        else {
            res.status(400).send("Couldn't create a post.");
        }
    });
});

// POST request to delete a post by driver/rider
router.post('/delete/:id', function (req, res) {

    var post_id = req.params.id;

    var sql = "DELETE FROM `post` where post_id = ? and email = ?";

    var inserts = [post_id, req.session.user.email];

    log('info', "Executing query:  " + mysql.format(sql, inserts));

    connection.query(mysql.format(sql, inserts), function (error, results) {
        if(error) throw error;
        log('info', "POST request to delete a post by driver/rider");
        if(results.affectedRows === 1) {
            res.status(201).send((results.insertId).toString());
        }
        else {
            res.status(400).send("Couldn't delete a post.");
        }
    });
});

// POST request to match driver with riders
router.post('/match', function (req, res) {

    var email = req.session.user.email;

    var sql = "CALL create_matches(?, @new_ride_id)";
    var inserts = [email];
    log('info', "Executing query: " + mysql.format(sql, inserts));

    connection.query(mysql.format(sql, inserts), function (error, results) {
        if(error) throw error;
        log('info', "POST request to match driver with riders:  " + results);

        res.status(201).send(results);
    });
});

// GET all the rider/driver information (this holds true for both rider and driver)
router.get('/show_matches/:ride_id', function (req, res) {

    var email = req.session.user.email;
    var ride_id = req.params.ride_id;
    var sql = null;
    var inserts = null;

    if (email === (JSON.parse(process.env.admin)).email) {
        sql = "SELECT * FROM post" +
              " WHERE `post`.ride_id = ?" +
              " ORDER BY `post`.post_type";
        inserts = [ride_id];
    }
    else {
        sql = "SELECT * FROM post" +
              " WHERE `post`.ride_id = ?" +
              " ORDER BY `post`.post_type";
        inserts = [ride_id, email];
    }

    log('info', "Executing query:  " + mysql.format(sql, inserts));

    connection.query(mysql.format(sql, inserts), function (error, results) {
        if(error) throw error;
        log('info', "GET all the rider/driver information:  " + results);
        res.status(200).send(results);
    });
});

// GET logged in user's post (TODAY)
router.get('/today', function(req, res) {

    var email = req.session.user.email;
    var sql = null;
    var inserts = null;

    if (email === (JSON.parse(process.env.admin)).email) {
        sql = "SELECT * FROM post" +
              " WHERE DATE(`post`.window_start_time) = ?";
        inserts = [mysql.raw('CURDATE()')];
    }
    else {
        sql = "SELECT * FROM post" +
              " WHERE `post`.email = ?" +
              " AND DATE(`post`.window_start_time) = ?";
        inserts = [email, mysql.raw('CURDATE()')];
    }

    log('info', "Executing query:  " + mysql.format(sql, inserts));

    connection.query(mysql.format(sql, inserts), function (error, results) {
        if (error) throw error;
        log('info', "GET logged in user's post (TODAY):  " + results);
        res.send(results);
    });
});

// GET logged in user's all posts (HISTORY)
router.get('/history', function(req, res) {

    var email = req.session.user.email;
    var sql = null;
    var inserts = null;

    if (email === (JSON.parse(process.env.admin)).email) {
        sql = "SELECT * FROM post" +
            " WHERE DATE(`post`.window_start_time) < ?";
        inserts = [mysql.raw('CURDATE()')];
    }
    else {
        sql = "SELECT * FROM post" +
            " WHERE `post`.email = ?" +
            " AND DATE(`post`.window_start_time) < ?";
        inserts = [email, mysql.raw('CURDATE()')];
    }

    log('info', "Executing query:  " + mysql.format(sql, inserts));

    connection.query(mysql.format(sql, inserts), function (error, results) {
        if (error) throw error;
        log('info', "GET logged in user's all posts (HISTORY):  " + results);
        res.send(results);
    });

});

// GET logged in user's specific post
router.get('/:post_id', function(req, res) {

    var email = req.session.user.email;
    var post_id = req.params.post_id;
    var sql = null;
    var inserts = null;

    if (email === (JSON.parse(process.env.admin)).email) {
        sql = "SELECT * FROM post" +
              " WHERE `post`.post_id = ?";
        inserts = [post_id];
    }
    else {
        sql = "SELECT * FROM post" +
              " WHERE `post`.email = ?" +
              " AND `post`.post_id = ?";
        inserts = [email, post_id];
    }

    log('info', "Executing query:  " + mysql.format(sql, inserts));

    connection.query(mysql.format(sql, inserts), function (error, results) {
        if (error) throw error;
        console.log("GET logged in user\'s all posts (HISTORY):  " + results);
        res.send(results);
    });

});

module.exports = router;