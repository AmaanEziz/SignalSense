drop procedure if exists init;
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

call init(8, true);
