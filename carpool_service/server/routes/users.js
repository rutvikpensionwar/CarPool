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


/* GET specific user using email id */
router.get('/:id', function(req, res) {

    var email = null;
    var sql = null;

    if(req.session.user) {
        email = req.session.user.email;
    }

    if (email === (JSON.parse(process.env.admin)).email) {
        sql = "SELECT * FROM user WHERE `user`.email = ?";
        var inserts = [req.params.id];
        log('info', "Executing query:  " + mysql.format(sql, inserts));

        connection.query(mysql.format(sql, inserts), function (error, results) {
            if (error) throw error;
            log('info', "GET specific user using email id:  " + results);
            res.status(200).send(results);
        });
    }
    else {
        res.status(401).send("Logged in user doesn't have access to this feature.");
    }
});

/* GET all users */
router.get('/', function(req, res) {

    var email = null;
    var sql = null;

    if(req.session.user) {
        email = req.session.user.email;
    }

    if (email === (JSON.parse(process.env.admin)).email) {
        sql = "SELECT * FROM user";
        log('info', "Executing query:  " + sql);
        connection.query(sql, function (error, results) {
            if (error) throw error;
            log('info', "Getting all users:  " + results);
            res.status(200).send(results);
        });
    }
    else {
        res.status(401).send("Logged in user doesn't have access to this feature.");
    }
});

router.post('/update', function(req, res) {

    var fname           = req.body.fname;
    var lname           = req.body.lname;
    var date_of_birth   = req.body.date_of_birth;
    var company         = req.body.company;
    var address         = req.body.address;
    var phone_number    = req.body.phone_number;
    var gender          = req.body.gender;
    var license_number  = req.body.license_number;

    var sql = "UPDATE user SET fname = ?, lname = ?, date_of_birth = ?, company = ?, address = ?, phone_number = ?, gender = ?, license_number = ? WHERE email = ?";
    var inserts = [fname, lname, date_of_birth, company, address, phone_number, gender, license_number, req.session.user.email];

    log('info', "Executing query :  " + mysql.format(sql, inserts));

    connection.query(mysql.format(sql, inserts), function (error, results) {
        if (error) throw error;
        log('info', "Updating the user:  " + req.session.user.email);
        if(results.affectedRows === 1) {
            res.status(201).send("User updated successfully");
        }
        else {
            res.status(400).send("Error while updating the user");
        }
    });
});

module.exports = router;