DROP DATABASE IF EXISTS db;
CREATE DATABASE db;
USE db;

CREATE TABLE `location` (
    location_id INTEGER NOT NULL,
    street_name VARCHAR(255),
    city VARCHAR(255),
    state VARCHAR(255),
    country VARCHAR(255),
    PRIMARY KEY (location_id)
);

CREATE TABLE `user` (
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255),
    fname VARCHAR(255),
    lname VARCHAR(255),
    date_of_birth DATE,
    company VARCHAR(255),
    address VARCHAR(255),
    phone_number VARCHAR(10),
    gender VARCHAR(255),
    license_number INTEGER,
    PRIMARY KEY (email)
);

CREATE TABLE `car` (
    email VARCHAR(255) NOT NULL,
    car_reg_number INTEGER,
    insurance_expiry_date DATE,
    car_name VARCHAR(255),
    capacity INTEGER,
    car_make VARCHAR(255),
    car_color VARCHAR(255),
    PRIMARY KEY (car_reg_number),
    FOREIGN KEY (email)
        REFERENCES user (email)
        ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `post` (
    post_id INTEGER NOT NULL AUTO_INCREMENT,
    email VARCHAR(255),
    post_type VARCHAR(255),
    window_start_time DATETIME NULL DEFAULT NULL,
    window_end_time DATETIME NULL DEFAULT NULL,
    source_id INTEGER,
    destination_id INTEGER,
    ride_id INTEGER DEFAULT NULL,
    PRIMARY KEY (post_id),
    FOREIGN KEY (email)
        REFERENCES user (email)
        ON DELETE CASCADE ON UPDATE CASCADE,
      FOREIGN KEY (source_id)
        REFERENCES location (location_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (destination_id)
        REFERENCES location (location_id)
        ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE `ride` (
    ride_id INTEGER NOT NULL AUTO_INCREMENT,
    journey_start_time DATETIME NULL DEFAULT NULL,
    car_reg_number INTEGER,
    source_id INTEGER,
    destination_id INTEGER,
    PRIMARY KEY (ride_id),
    FOREIGN KEY (car_reg_number)
        REFERENCES car (car_reg_number)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (source_id)
        REFERENCES location (location_id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (destination_id)
        REFERENCES location (location_id)
        ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE `rided` (
    email VARCHAR(255),
    ride_id INTEGER,
    PRIMARY KEY (email , ride_id),
    FOREIGN KEY (email)
        REFERENCES user (email)
        ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (ride_id)
        REFERENCES ride (ride_id)
        ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE `post` AUTO_INCREMENT = 100;

ALTER TABLE `ride` AUTO_INCREMENT = 1000;

ALTER TABLE `post`
        ADD CONSTRAINT `ct_ride` FOREIGN KEY(ride_id) REFERENCES ride(ride_id)
        ON UPDATE CASCADE;

CREATE INDEX idx_email
ON user (email);

CREATE INDEX idx_post
ON post(email, post_type, window_start_time, window_end_time, source_id, destination_id);