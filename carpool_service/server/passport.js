var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
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

passport.serializeUser(function(user, done) {
    done(null, user.email);
});

passport.deserializeUser(function(user, done) {
    console.log("SQL Query: ", "SELECT * FROM user WHERE `user`.email = '" + user + "'");
    connection.query("SELECT * FROM user WHERE `user`.email = '" + user + "'",
    function(error, results) {
        done(error, results[0]);
    });
});

passport.use('local-signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
},
function(email, password, done) {
    var sql = "SELECT * FROM ?? WHERE email = ? and password = ?";
    var inserts = ['user', email, password];
    console.log("SQL Query: ", mysql.format(sql, inserts));

    connection.query(mysql.format(sql, inserts), function (error, results) {
        if (error) return done(error);
        if (results.length) {
            var user = results[0];
            return done(null, user)
        } else {
            return done(null, false);
        }
    });
}));
