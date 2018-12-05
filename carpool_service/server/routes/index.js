require('dotenv').config();
require('winston-mongodb');
var express = require('express');
var winston = require('winston');
var bcrypt = require('bcrypt');
var moment = require('moment');

var router = express.Router();

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

// Signing in the user
router.post('/signin', function(req, res) {

    var email = req.body.email;
    var password = req.body.password;
    // console.log(email);
    // console.log((JSON.parse(process.env.admin)).email);
    // console.log((JSON.parse(process.env.admin)).password);

    if (email === (JSON.parse(process.env.admin)).email && password === (JSON.parse(process.env.admin)).password) {
        req.session.user = JSON.parse(process.env.admin);
        res.status(200).send("Admin credentials verified.");
    }
    else {
        var sql = "SELECT * FROM user WHERE email = ?";
        var inserts = [email];

        log('info', "Executing query :  " + mysql.format(sql, inserts));

        connection.query(mysql.format(sql, inserts), function (error, results) {
            if (error) throw error;
            if (results.length === 1) {
                bcrypt.compare(password, results[0].password, function(err, response) {
                    if(response) {
                        // Passwords match
                        req.session.user = results[0];
                        log('info', "Signing in the user:  " + email);
                        res.status(200).send("Successfully logged in !!!");
                    } else {
                        // Passwords don't match
                        // 400 Bad Request
                        log('error', "Incorrect password");
                        res.status(401).send("Incorrect password");
                    }
                });
            }
            else if(results.length > 1) {
                // 409 Conflict
                log('error', "Duplicate user entries in database:  " + email);
                res.status(409).send("Duplicate user entries in database");
            }
            else {
                // 404 Not Found
                log('error', "User not found:  " + email);
                res.status(404).send("User not found");
            }
        });
    }
});

// Signing up the user
router.post('/signup', function(req, res) {
    var email           = req.body.email;
    var password        = req.body.password;
    var fname           = req.body.fname;
    var lname           = req.body.lname;

    bcrypt.hash(password, 10, function(err, hash) {
        // Store hash in database
        if(err) throw err;
        var sql = "INSERT INTO user(email, password, fname, lname)" +
            " VALUES(?, ?, ?, ?)";
        var inserts = [email, hash, fname, lname];

        log('info', "Executing query :  " + mysql.format(sql, inserts));

        connection.query(mysql.format(sql, inserts), function (error, results) {
            if (error) throw error;
            log('info', "Signing up the user:  " + email);
            if(results.affectedRows === 1) {
                res.status(201).send("User created successfully");
            }
            else {
                res.status(400).send("Error while registering the user");
            }
        });
    });
});

// Get current logged in user
router.get('/current', function (req, res) {

    var logged_in_user = null;

    if(req.session.user) {
        logged_in_user = req.session.user.email;
    }

    if (logged_in_user === (JSON.parse(process.env.admin)).email) {
        var results = [{
            "email" : "admin@sjsu.edu",
            "fname" : "Admin",
            "lname" : ""
        }];
        res.status(201).send(results);
    }
    else {
        var sql = "select * from user where user.email = ?";
        var inserts = [logged_in_user];

        log('info', "Executing query:  " + mysql.format(sql, inserts));

        connection.query(mysql.format(sql, inserts), function (error, results) {
            if (error) throw error;
            log('info', "Get current logged in user info: " + results);
            if(results.length === 1) {
                res.status(201).send(results);
            }
            else {
                res.status(400).send("User hasn't logged in.");
            }
        });
    }
});

// Logging out the user
router.get('/logout', function (req, res) {
    log('info', "Logging out the user:  " + req.session.user.email);
    req.session.destroy();
    res.status(200).send("User successfully logged out");
});

module.exports = router;
