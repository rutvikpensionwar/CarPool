CREATE DEFINER=`root`@`localhost` PROCEDURE `create_matches`(IN driver VARCHAR(255), OUT new_ride_id INTEGER)
BEGIN

-- DECLARE @v_window_start_time, @v_window_end_time, @v_ride_window_start_time TIMESTAMP DEFAULT NULL;
-- DECLARE @v_ride_id, @v_source_id, @v_destination_id, @v_car_reg_number, @v_new_ride_id INTEGER DEFAULT NULL;
SELECT 
    `p`.`ride_id`
	INTO @v_ride_id
FROM
    `post` `p`
WHERE
    `p`.`email` = driver
        AND DATE(`p`.`window_start_time`) = CURDATE();
    
IF @v_ride_id IS NOT NULL THEN
	SET @v_new_ride_id = NULL;
ELSE
	BEGIN

		SELECT 
				`c`.`car_reg_number`
			INTO @v_car_reg_number FROM
				`car` `c`
			WHERE
				`c`.`email` = driver;
			
		-- SELECT @v_car_reg_number;
            
		SELECT 
				`p`.`window_start_time`,
				`p`.`window_end_time`,
				`p`.`source_id`,
				`p`.`destination_id`
			INTO @v_window_start_time, @v_window_end_time, @v_source_id, @v_destination_id FROM
				`post` `p`
			WHERE
				`p`.`email` = driver
					AND DATE(`p`.`window_start_time`) = CURDATE()
					AND `p`.`ride_id` IS NULL;

		-- SELECT @v_window_start_time, @v_window_end_time, @v_ride_window_start_time;

		SELECT 
			`p`.`window_start_time`
		INTO @v_ride_window_start_time FROM
			`post` `p`
		WHERE
			`p`.`source_id` = @v_source_id
				AND `p`.`destination_id` = @v_destination_id
				AND `p`.`window_start_time` >= @v_window_start_time
				AND `p`.`window_start_time` <= @v_window_end_time
				AND `p`.`ride_id` IS NULL
		ORDER BY `p`.`window_start_time` DESC
		LIMIT 1;
		-- SELECT @v_window_start_time;

		
		INSERT INTO `ride` (`journey_start_time`, `car_reg_number`, `source_id`, `destination_id`)
		VALUES (@v_ride_window_start_time, @v_car_reg_number, @v_source_id, @v_destination_id);

		SELECT LAST_INSERT_ID() INTO @v_new_ride_id;
		-- SELECT @v_new_ride_id;

		BEGIN
			DECLARE `_rollback` BOOL DEFAULT 0;
			DECLARE CONTINUE HANDLER FOR SQLEXCEPTION SET `_rollback` = 1;
        
			START TRANSACTION;
            
			INSERT INTO `rided` (`ride_id`, `email`)
				SELECT 
					@v_new_ride_id, `p`.`email`
				FROM
					`post` `p`
				WHERE
					`p`.`source_id` = @v_source_id
						AND `p`.`destination_id` = @v_destination_id
						AND `p`.`window_start_time` >= @v_window_start_time
						AND `p`.`window_start_time` <= @v_window_end_time
						AND `p`.`ride_id` IS NULL
				LIMIT 5;

			UPDATE `post` `p` 
			SET 
				`p`.`ride_id` = @v_new_ride_id
			WHERE
				`p`.`source_id` = @v_source_id
					AND `p`.`destination_id` = @v_destination_id
					AND `p`.`window_start_time` >= @v_window_start_time
					AND `p`.`window_start_time` <= @v_window_end_time
					AND `p`.`ride_id` IS NULL LIMIT 5;
                    
			IF `_rollback` THEN
				ROLLBACK;
			ELSE
				COMMIT;
			END IF;
		END;
	END;
END IF;
SELECT @v_new_ride_id;
END