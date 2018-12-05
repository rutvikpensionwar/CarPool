-- All inserts are done by specifying the column names so that it's easy to understand the structure of the table
-- If data exists in these tables, delete it.
DELETE FROM user;
DELETE FROM car;
DELETE FROM location;
DELETE FROM post;
DELETE FROM ride;
DELETE FROM rided;

-- The location table is something which is predefined by the admin
INSERT INTO location
(location_id, street_name, city, state, country)
VALUES
(1001, 'Pine Street', 'San Jose', 'CA', 'USA'),
(1002, 'Maple Street', 'Fremont', 'CA', 'USA'),
(1003, 'Cedar Street', 'Sunnyvale', 'CA', 'USA'),
(1004, 'Lake Street', 'Milpitas', 'CA', 'USA'),
(1005, 'Hill Street', 'Oakland', 'CA', 'USA');

-- These users are created while signup so that they hash the passwords and store them in DB
-- INSERT INTO user
-- (email, password, fname, lname, date_of_birth, company, address, phone_number, gender, license_number)
-- VALUES
-- ('harry@sjsu.edu', '$2a$10$HjS/yPbo/6nmGnqLYU4eIeZiw4O4IUKTFTNG0UHL3y1', 'Harry', 'Potter', '1990-01-01', 'Adobe', '1st Street, San Jose', '1111111111', 'M', 111111111),
-- ('ron@sjsu.edu', '$2a$10$El74ZxAPV9GUi/fl3n.7C.6TF/IRfm8VZkqHJBMcX4qJWieMVHTu2', 'Ron', 'Weasley', '1990-02-02', 'IBM', '2nd Street, San Jose', '2222222222', 'M', 222222222),
-- ('harmoine@sjsu.edu', '$2a$10$Pk/eNuLpGSBfFylKS.bdhut6mfpM3qeWWffKZ1UwCJncD6q/FZJ9G', 'Harmoine', 'Granger', '1990-03-03', 'Cisco', '3rd Street, San Jose', '3333333333', 'F', 333333333),
-- ('draco@sjsu.edu', '$2a$10$9klEGnBIIFh2yUQW4kRveeE9XuSoaDK2F0HTvxDVc2yIh7WOOp2Aa', 'Draco', 'Lamfoy', '1990-04-04', 'Tesla', '4th Street, San Jose', '4444444444', 'M', 444444444),
-- ('ginny@sjsu.edu', '$2a$10$ewNBrElo6.lCuuf8J8tgb./dHgA9SuFqZNVGjWAhFAAI34s61L.Si', 'Ginny', 'Weasley', '1990-05-05', 'Google', '5th Street, San Jose', '5555555555', 'M', 555555555),
-- ( 'neville@sjsu.edu', '$2a$10$.eehxcOndc3fLZgrGSe5ae4xhVxOH2g1k2R5lwIbi288sxGBybtLG', 'Neville', 'Longbottom', '1990-06-06', 'Microsoft', '6th Street, San Jose', '6666666666', 'M', 666666666),
-- ('george@sjsu.edu', '$2a$10$letFwL46ldrJVDAvfT8Q.OcgDmfILhWCTNgUpqqcUW2CvAyh53a9a', 'George', 'Weasley', '1990-07-07', 'Tesla', '7th Street, San Jose', '7777777777', 'M', 777777777),
-- ('fred@sjsu.edu', '$2a$10$/yzJEhPEDbxEsQmrO9oEJ.3Mug3cT3EiSmZqoK4diK6KZ5rmTtcey', 'Fred', 'Weasley', '1990-08-08', 'Tesla', '8th Street, San Jose', '8888888888', 'M', 888888888),
-- ('bill@sjsu.edu', '$2a$10$cebiP5tDx9DlZnn1Au/AKOrtEELWS01sIWI8yrX5NB8thq9JMOi4m', 'Bill', 'Weasley', '1990-09-09', 'Apple', '9th Street, San Jose', '9999999999', 'M', 999999999),
-- ('dean@sjsu.edu', '$2a$10$ocha/ZWSSrkTIBuSwlawyeKXL6fWD0crkZVogQtrH5oTKfIShVUB2', 'Dean', 'Thomas', '1990-10-10', 'Ford', '10th Street, San Jose', '1111122222', 'M', 111112222),
-- ('cho@sjsu.edu', '$2a$10$pqxS1LaS2tBjyU6v9.qcD.xOEIB0.97Hwp.0jOS019Jqhctrf2APa', 'Cho', 'Chang', '1990-11-11', 'Alibaba', '11th Street, San Jose', '2222233333', 'F', 222223333),
-- ('seamus@sjsu.edu', '$2a$10$6FKaBHfENslB9W78nzAtA.4CLpE4RHv35UZaMtgnQz.H6t/XmeZBm', 'Seamus', 'Finnigan', '1990-12-12', 'Samsung', '12th Street, San Jose', '3333344444', 'M', 333334444);

-- We are planning for a portal where the user can register his car in his profile section
INSERT INTO car
(email, car_reg_number, insurance_expiry_date, car_name, capacity, car_make, car_color)
VALUES
('harry@sjsu.edu', 111111110, '2020-01-01', 'Journey', 5, 'Dodge', 'Black');
-- ('ron@sjsu.edu', 222222220, '2020-02-02', 'Grand Caravan', 5, 'Dodge', 'White'),
-- ('harmoine@sjsu.edu', 333333330, '2020-03-03', 'Outlander', 5, 'Mitsubishi', 'Red'),
-- ('draco@sjsu.edu', 444444440, '2020-04-04', '4Runner', 5, 'Toyota', 'Blue'),
-- ('ginny@sjsu.edu', 555555550, '2020-05-05', 'Armada', 5, 'Nissan', 'Black'),
-- ('neville@sjsu.edu', 666666660, '2020-06-06', 'Pathfinder', 5, 'Nissan', 'Black'),
-- ('george@sjsu.edu', 777777770, '2020-07-07', 'Yukon', 5, 'GMC', 'White'),
-- ('fred@sjsu.edu', 888888880, '2020-08-08', 'Acadia', 5, 'GMC', 'Black'),
-- ('bill@sjsu.edu', 999999990, '2020-09-09', 'Grand Caravan', 5, 'Dodge', 'Silver'),
-- ('dean@sjsu.edu', 111112220, '2020-10-10', 'Journey', 5, 'Dodge', 'Black'),
-- ('cho@sjsu.edu', 222223330, '2020-11-11', 'Armada', 5, 'Nissan', 'Silver'),
-- ('seamus@sjsu.edu', 333334440, '2020-12-12', 'Journey', 5, 'Dodge', 'Grey');

-- In order for application to work, you need to replace window start/end time with TODAY's date
-- INSERT INTO post
-- (email, post_type, window_start_time, window_end_time, source_id, destination_id, ride_id)
-- VALUES
-- ('harry@sjsu.edu', 'driver', '2018-11-24 08:00:00', '2018-11-24 10:00:00', 1001, 1005, null),
-- ('ron@sjsu.edu', 'rider', '2018-11-24 09:00:00', '2018-11-24 10:00:00', 1001, 1005, null),
-- ('harmoine@sjsu.edu', 'rider', '2018-11-24 09:30:00', '2018-11-24 11:00:00', 1001, 1005, null),
-- ('ginny@sjsu.edu', 'rider', '2018-11-24 08:45:00', '2018-11-24 11:00:00', 1001, 1005, null),
-- ('neville@sjsu.edu', 'rider', '2018-11-24 10:30:00', '2018-11-24 11:00:00', 1001, 1005, null),
-- ('draco@sjsu.edu', 'driver', '2018-11-22 08:00:00', '2018-11-22 10:00:00', 1001, 1002, null),
-- ('dean@sjsu.edu', 'rider', '2018-11-22 09:00:00', '2018-11-22 10:00:00', 1001, 1002, null),
-- ('seamus@sjsu.edu', 'rider', '2018-11-22 09:30:00', '2018-11-22 11:00:00', 1001, 1002, null),
-- ('cho@sjsu.edu', 'rider', '2018-11-22 10:30:00', '2018-11-22 11:00:00', 1001, 1002, null);