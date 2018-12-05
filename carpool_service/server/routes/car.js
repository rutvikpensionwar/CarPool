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

// Registering a car
router.post('/register', function(req, res) {

    var email           = req.session.user.email;
    var car_reg_number  = req.body.car_reg_number;
    var insurance_exp   = req.body.insurance_expiry_date;
    var car_name        = req.body.car_name;
    var capacity        = req.body.capacity;
    var car_make        = req.body.car_make;
    var car_color       = req.body.car_color;


    var sql = "INSERT INTO car(email, car_reg_number, insurance_expiry_date, car_name, capacity, car_make, car_color)" +
        " VALUES(?, ?, ?, ?, ?, ?, ?)";
    var inserts = [email, car_reg_number, insurance_exp, car_name, capacity, car_make, car_color];

    log('info', "Executing query :  " + mysql.format(sql, inserts));

    connection.query(mysql.format(sql, inserts), function (error, results) {
        if (error) throw error;
        log('info', "Registering a car for user:  " + req.session.user.email);
        if(results.affectedRows === 1) {
            res.status(201).send("Car registered successfully");
        }
        else {
            res.status(400).send("Error while registering the car");
        }
    });
});

// Updating the car details
router.post('/update/:id', function(req, res) {

    var car_reg_number  = req.params.id;
    var insurance_exp   = req.body.insurance_expiry_date;
    var car_name        = req.body.car_name;
    var capacity        = req.body.capacity;
    var car_make        = req.body.car_make;
    var car_color       = req.body.car_color;

    var sql = "UPDATE car SET insurance_expiry_date = ?, car_name = ?, capacity = ?, car_make = ?, car_color = ? WHERE car_reg_number = ? and email = ?";
    var inserts = [insurance_exp, car_name, capacity, car_make, car_color, car_reg_number, req.session.user.email];

    log('info', "Executing query :  " + mysql.format(sql, inserts));

    connection.query(mysql.format(sql, inserts), function (error, results) {
        if (error) throw error;
        log('info', "Updating the car details for user:  " + req.session.user.email);
        if(results.affectedRows === 1) {
            res.status(201).send("Car details updated successfully");
        }
        else {
            res.status(400).send("Error while updating the car details");
        }
    });
});

module.exports = router;