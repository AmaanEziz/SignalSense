
/*drop procedure if exists init;
delimiter $$
create procedure init(IN p_num_of_phases int, IN p_make_dummy_data boolean)
begin

declare i int default 0;
declare v_intersection_id varchar(36);
declare v_node_id varchar(36);

SET FOREIGN_KEY_CHECKS = 0;
truncate table Light;
truncate table Phase;
truncate table Node;
truncate table IntersectionStreet;
truncate table Street;
truncate table Intersection;
SET FOREIGN_KEY_CHECKS = 1;
-- Create the intersection
call add_intersection(.123, .221);
set v_intersection_id = (select intersectionID from Intersection);
-- add the Phases to hte Phase table.
phaseLoop: LOOP
	if i = p_num_of_phases then
		LEAVE phaseLoop;
	END IF;
    SET i = i + 1;
    call add_phase('1', v_intersection_id);
END LOOP;
-- Update the rowNum for the Phase table.
SET SQL_SAFE_UPDATES = 0;
with update_phase as(
select *, row_number() over (partition by intersectionID) rn from Phase)
update Phase set phaseRowId = (select rn from update_phase where update_phase.phaseID = Phase.phaseID);
SET SQL_SAFE_UPDATES = 1;

IF p_make_dummy_data THEN
	call add_node('NORTHBOUND DUMMY ST', v_intersection_id, '192.168.1.1', true);
    set v_node_id = (select nodeID from Node);
    call add_light(v_node_id, 1, '1');
    call add_light(v_node_id, 2, '2');
    call add_light(v_node_id, 3, '1');
    call add_light(v_node_id, 5, '3');

    SET SQL_SAFE_UPDATES = 0;
    with update_light as(
		select *, row_number() over (partition by nodeID) rn from Light)
	update Light set lightRowID = (select rn from update_light where update_light.lightID = Light.lightID);
    SET SQL_SAFE_UPDATES = 1;
end if;
end$$
delimiter ;
*/

DROP PROCEDURE IF EXISTS init;
DELIMITER $$
CREATE PROCEDURE init(IN p_num_of_phases INT, IN p_make_dummy_data BOOLEAN)
BEGIN
	DECLARE i INT DEFAULT 0;
    DECLARE v_intersection_id VARCHAR(36);
    DECLARE v_node_id VARCHAR(36);
    
    DECLARE table_size INT;
    SET table_size = (SELECT COUNT(*) FROM Intersection);
    IF table_size = 0 THEN
    
		SET FOREIGN_KEY_CHECKS = 1;
		
		CALL add_intersection(.123, .221);
		SET v_intersection_id = (SELECT intersectionID FROM Intersection);
		
		phaseLoop: LOOP
			IF i = p_num_of_phases THEN
				LEAVE phaseLoop;
			END IF;
			SET i = i + 1;
			CALL add_phase('1', v_intersection_id);
		END LOOP;
		
		SET SQL_SAFE_UPDATES = 0;
		WITH update_phase AS (
			SELECT *, row_number() OVER (PARTITION BY intersectionID) rn FROM Phase)
			UPDATE Phase SET phaseRowID = (SELECT rn FROM update_phase WHERE update_phase.phaseID = Phase.phaseID);
		SET SQL_SAFE_UPDATES = 1;
		
		IF p_make_dummy_data THEN
			CALL add_node('NORTHBOUND DUMMY ST', v_intersection_id, '192.168.1.1', true);
			SET v_node_id = (SELECT nodeID FROM Node);
			CALL add_light(v_node_id, 1, '1');
			CALL add_light(v_node_id, 2, '2');
			CALL add_light(v_node_id, 3, '3');
			CALL add_light(v_node_id, 4, '4');
			
			SET SQL_SAFE_UPDATES = 0;
			WITH update_light AS (SELECT *, row_number() OVER (PARTITION BY nodeID) rn FROM Light)
			UPDATE Light SET lightRowID = (SELECT rn FROM update_light WHERE update_light.lightID = Light.lightID);
			SET SQL_SAFE_UPDATES = 1;
		END IF;

        ELSE SELECT 'Not Initialized';
	END IF;
END $$
DELIMITER ;

