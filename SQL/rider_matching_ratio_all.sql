CREATE DEFINER=`root`@`localhost` PROCEDURE `rider_matching_ratio_all`(OUT matched_riders INTEGER, OUT unmatached_riders INTEGER)
BEGIN
	SELECT COUNT(*) INTO @matched_riders FROM post
	WHERE`post`.post_type = 'rider' AND `post`.ride_id IS NOT NULL;

	SELECT COUNT(*) INTO @unmatached_riders FROM post
	WHERE `post`.post_type = 'rider' AND `post`.ride_id IS NULL;
    
    SELECT @matched_riders, @unmatached_riders;
END