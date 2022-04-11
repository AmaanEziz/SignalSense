drop procedure if exists add_street;
DELIMITER $$
create procedure add_street(
	in in_streetName VARCHAR(45), in in_streetDirection VARCHAR(45), in in_beginLatitude decimal(3,3),
	in in_beginLongitude  decimal(3,3), in in_endLatitude  decimal(3,3), in in_endLongitude  decimal(3,3))

begin
	declare uuid varchar(36);
	SET uuid = (select UUID());
	INSERT INTO Street
		(streetID, streetName, streetDirection, beginLatitude, beginLongitude, endLatitude, endLongitude)
	VALUES
		(uuid, in_streetName, in_streetDirection, in_beginLatitude, in_beginLongitude,
		in_endLatitude, in_endLongitude);
	select * from Street where streetID = uuid;

end$$
DELIMITER ;


/* 
	Procedure to add intersection
*/
drop procedure if exists add_intersection;
DELIMITER $$
create procedure add_intersection(IN lat decimal(3,3), IN lon decimal(3,3))
begin
	declare uuid varchar(36);
    SET uuid = (select uuid());
	insert into Intersection values (uuid, lat, lon);
    select * from Intersection where intersectionID = uuid;
END$$
DELIMITER ;


/*
	Procedure to add intersectionStreet
*/
drop procedure if exists add_intersectionStreet;
DELIMITER $$
CREATE PROCEDURE add_intersectionStreet(IN intersectionID VARCHAR(36), IN streetID VARCHAR(36), streetPM DECIMAL(3, 2))
begin
	DECLARE uuid VARCHAR(36);
	SET uuid = (SELECT UUID());
	INSERT INTO IntersectionStreet
		(intersectionStreetID, intersectionID, streetID, streetPostmile)
	VALUES
		(uuid, intersectionID, streetID, streetPM);
	SELECT * FROM IntersectionStreet WHERE intersectionStreetID = uuid;
END$$
DELIMITER ;

/* 
	Procedure to add a phase
*/
drop procedure if exists add_phase;
DELIMITER $$
create procedure add_phase(in in_phaseTypeID varchar(36), in in_intersectionID varchar(36))
begin
	declare uuid varchar(36);
    set uuid = (select UUID());
	INSERT INTO Phase
		(phaseID, phaseTypeID, intersectionID)
	VALUES
		(uuid, in_phaseTypeID, in_intersectionID);

    select * from Phase where phaseID = uuid;
end$$
DELIMITER ;

/*
	Adds nodes to the node table
*/
drop procedure if exists add_node;
DELIMITER $$
create procedure add_node(
IN in_nodeDescription VARCHAR(100), IN in_intersectionID varchar(36), IN in_ipaddress varchar(15), IN in_isalive boolean)
begin
	declare uuid varchar(36);
    SET uuid = (select uuid());
	insert into Node(NodeID, nodeDescription, intersectionID, ipAddress, isAlive) values(uuid, in_nodeDescription, in_intersectionID, in_ipaddress, in_isalive);
    select * from Node where NodeID = uuid;
END$$
DELIMITER ;


 /*
	This will update or insert a light.
    To update a light pass in_id, to insert pass null to in_id
*/
drop procedure if exists add_light;
DELIMITER $$
create procedure add_light(IN in_node_id varchar(36), IN in_light_phase int, IN in_light_rowID int, IN in_state varchar(100))
begin
	declare temp_id varchar(36);
    set temp_id = (select UUID());
	insert into Light(lightID, nodeID, lightPhase, lightRowID, state) values (temp_id, in_node_id, in_light_phase, in_light_rowID, in_state);
    with update_light as(
		select *, row_number() over (partition by nodeID) rn from Light)
	update Light set lightRowID = (select rn from update_light where update_light.lightID = Light.lightID) where nodeID = in_node_id;
    select * from Light where lightID = temp_id;
END$$
DELIMITER ;

drop procedure if exists get_phase_stream;
DELIMITER $$
create procedure get_phase_stream(IN in_intersection_in varchar(36))
begin
with colors as (
select *,
case
	WHEN state = 'RED' then 1
    ELSE 0
END as reds,
case
	WHEN state = 'GREEN' then 1
    ELSE 0
END as greens,
case
	WHEN state = 'YELLOW' then 1
    ELSE 0
END as yellows
from Phase_vw where intersectionID = in_intersection_in
order by phaseRowId
), color_str as(
select
	lpad(CONV(group_concat(colors.reds order by phaseRowId desc SEPARATOR ''), 2, 16), 2, '0') red_str,
	lpad(CONV(group_concat(colors.greens order by phaseRowId desc SEPARATOR ''), 2, 16), 2, '0') green_str,
    lpad(CONV(group_concat(colors.yellows order by phaseRowId desc SEPARATOR ''), 2, 16), 2, '0') yellow_str
from colors
), cnt_str as(
	select lpad(CONV(count(*), 10, 16), 2, '0') num_of_phases from Phase where intersectionID = in_intersection_in
), phase_str as (
select group_concat(concat(lpad(CONV(Phase.phaseRowId, 10, 16), 2, '0'), ':', '00:00:00:00:00:00:00:00:00:00:00:00') SEPARATOR ':') phase_str from Phase where intersectionID = in_intersection_in order by phaseRowId
)
select CONCAT('CD:', cnt_str.num_of_phases, ':', phase_str.phase_str, ':',
			  color_str.red_str, ':', color_str.yellow_str, ':', color_str.green_str, ':',
              '00:00:00:00:00:00:00:00:00') `data.data` from color_str, cnt_str, phase_str;
end$$
DELIMITER ;



/*
	Updates a node, pass null to location, ipaddress or isalive to keep the original value
*/
DROP PROCEDURE IF EXISTS patch_node;
DELIMITER $$
create procedure patch_node(IN in_node_id varchar(36),
							IN in_description VARCHAR(100),
                            IN in_intersectionID VARCHAR(36),
                            IN in_ipaddress varchar(15),
                            IN in_isalive boolean)
begin
	if in_description is not null then
		update Node set nodeDescription = in_description where nodeID = in_node_id;
	end if;
	if in_intersectionID is not null then
		update Node set intersectionID = in_intersectionID WHERE nodeID = in_node_id;
	end if;
	if in_ipaddress is not null then
		update Node set ipaddress = in_ipaddress where nodeID = in_node_id;
	end if;
	if in_isalive is not null then
		update Node set isalive = in_isalive where nodeID = in_node_id;
	end if;
    select * from Node where nodeID = in_node_id;
END $$
DELIMITER ;

/*
	Removes the node and it's children lights
*/
DROP PROCEDURE IF EXISTS remove_node;
DELIMITER $$
create procedure remove_node(IN in_node_id varchar(36))
begin
	delete from light where nodeID = in_node_id;
    delete from node where nodeID = in_node_id;
END$$
DELIMITER ;

/*
	This will update or insert a light.
    To update a light pass in_id, to insert pass null to in_id
*/
DROP PROCEDURE IF EXISTS update_light;
DELIMITER $$
create procedure update_light(IN in_id VARCHAR(36),
								IN in_node_id VARCHAR(36),
                                IN in_light_phase int,
                                IN in_light_rowID INT,
                                IN in_state varchar(100))
begin
	declare temp_id VARCHAR(36);
	IF in_id is null then
		insert into light(nodeID, lightPhase, lightRowID, state) values ( in_node_id, in_light_phase, in_light_rowID, in_state);
        -- can also do a Trigger before insert but this makes it so only update_light does it.
        set temp_id = last_insert_id();
        WITH light_update AS (
			select lightID, ROW_NUMBER() OVER (PARTITION BY nodeID) as new_row_num
			FROM light
			WHERE nodeID = IN_NODE_ID
		) update light set lightID = (select light_update.new_row_num from light_update where light.lightID = light_update.lightID) WHERE nodeID = IN_NODE_ID AND light.lightID = temp_id;
	else
		update light set
			lightPhase = in_light_phase,
            state = in_state
		WHERE
			nodeID = in_node_id
			and lightID = in_id;
	END IF;
    select * from light where lightID = temp_id;
END$$
DELIMITER ;

/*
 This will update or insert a light.
	 To update a light pass in_id, to insert pass null to in_id
*/
drop procedure if exists add_light;
DELIMITER $$
create procedure add_light(IN in_node_id varchar(36), IN in_light_phase int, IN in_state varchar(100))
begin
 declare temp_id varchar(36);
	 set temp_id = (select UUID());
 insert into Light(lightID, nodeID, lightPhase, state) values (temp_id, in_node_id, in_light_phase, in_state);
 -- can also do a Trigger before insert but this makes it so only update_light does it.
-- 	WITH light_update AS (
-- 		select id, ROW_NUMBER() OVER (PARTITION BY node_id) as new_row_num
-- 		FROM light
-- 		WHERE node_id = IN_NODE_ID
-- 	)update light set light_id = (select light_update.new_row_num from light_update where light.id = light_update.id) WHERE node_id = IN_NODE_ID AND light.id = temp_id;
	 select * from Light where lightID = temp_id;
END$$
DELIMITER ;
DELIMITER $$
drop procedure if exists patch_light;
create procedure patch_light(IN in_lightID varchar(36), IN in_light_phase varchar(36), IN in_state varchar(100))
begin
	if in_light_phase is not null then
		update Light set lightPhase = in_light_phase where lightID = in_lightID;
	end if;
	if in_state is not null then
		update Light set state = in_state where lightID = in_lightID;
	end if;
    select * from Light where lightID = in_lightID;
END $$
DELIMITER ;

 /*
	This will update a nodes phase status. eg. phase 3 is RED.
*/
DROP PROCEDURE IF EXISTS update_phase_status;
DELIMITER $$
create procedure update_phase_status(IN in_id VARCHAR(36), IN in_node_id varchar(36), IN in_phase int, IN in_state varchar(100))
begin
	update light set state = in_state
    where nodeID = in_node_id
    and lightPhase = in_phase
    AND lightID = in_id;
end$$
DELIMITER ;


/*
	Procedure to get a stream for a given intersection
*/
drop procedure if exists get_phase_stream;
DELIMITER $$
create procedure get_phase_stream(IN in_intersection_in varchar(36))
begin
with colors as (
select *,
case
	WHEN state = 'RED' then 1
    ELSE 0
END as reds,
case
	WHEN state = 'GREEN' then 1
    ELSE 0
END as greens,
case
	WHEN state = 'YELLOW' then 1
    ELSE 0
END as yellows
from Phase_vw where intersectionID = in_intersection_in
order by phaseRowId
), color_str as(
select
	lpad(CONV(group_concat(colors.reds order by phaseRowId desc SEPARATOR ''), 2, 16), 2, '0') red_str,
	lpad(CONV(group_concat(colors.greens order by phaseRowId desc SEPARATOR ''), 2, 16), 2, '0') green_str,
    lpad(CONV(group_concat(colors.yellows order by phaseRowId desc SEPARATOR ''), 2, 16), 2, '0') yellow_str
from colors
), cnt_str as(
	select lpad(CONV(count(*), 10, 16), 2, '0') num_of_phases from Phase where intersectionID = in_intersection_in
), phase_str as (
select group_concat(concat(lpad(CONV(Phase.phaseRowId, 10, 16), 2, '0'), ':', '00:00:00:00:00:00:00:00:00:00:00:00') SEPARATOR ':') phase_str from Phase where intersectionID = in_intersection_in order by phaseRowId
)
select CONCAT('CD:', cnt_str.num_of_phases, ':', phase_str.phase_str, ':',
			  color_str.red_str, ':', color_str.yellow_str, ':', color_str.green_str, ':',
              '00:00:00:00:00:00:00:00:00') `data.data` from color_str, cnt_str, phase_str;
end$$
DELIMITER ;

/*
--SET GLOBAL log_bin_trust_function_creators = 1;
drop function if exists get_image_state;
DELIMITER $$
create function get_image_state(p_nodeID varchar(36))
returns varchar(100)
NOT DETERMINISTIC
begin
	return (select concat(p_nodeID,'_', group_concat(state, lightPhase order by lightRowID desc SEPARATOR '')) 
	from Light where nodeID = p_nodeID);
end$$
DELIMITER ;
*/


DELIMITER $$
create procedure save_image(in p_nodeID varchar(36))
begin
	declare img varchar(100);
	SET img = (select concat(p_nodeID,'_', group_concat(state, lightPhase order by lightRowID desc SEPARATOR '')) 
				ßfrom Light where nodeID = p_nodeID);
    insert into ImageFileName values (DEFAULT, img);
end$$
DELIMITER ;

drop procedure if exists  get_image;
DELIMITER $$
create procedure get_image(in p_nodeID varchar(36))
begin
	declare v_img varchar(100);
    declare v_fileName varchar(100);
    SET v_img = (select concat(p_nodeID,'_', group_concat(state, lightPhase order by lightRowID desc SEPARATOR '')) 
				from Light where nodeID = p_nodeID);
    SET v_fileName = (select img from ImageFileName where img = v_img);
    if v_fileName is null then
		select 'NOT_REGISTERED', concat(v_img, '.png') as img;
    ELSE
		select 'REGISTERED', concat(v_img, '.png') as img;
    end if;
end$$
DELIMITER ;


/*
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

drop procedure if exists get_all_data;
DELIMITER $$
create procedure get_all_data()
begin
	declare temp varchar(4000);
	set temp = '{}';
	set temp = JSON_INSERT(temp, '$.intersections', (select json_arrayagg(json_object('intersectionID', intersectionID,'latitude', latitude,'longitude', longitude)) from Intersection));
	set temp = JSON_INSERT(temp, '$.nodes', (select json_arrayagg(json_object('nodeID', nodeID, 'nodeDescription', nodeDescription, 'intersectionID', intersectionID, 'ipAddress', ipAddress, 'isAlive', isAlive)) from Node));
	set temp = JSON_INSERT(temp, '$.lights', (select json_arrayagg(json_object('lightID', lightID,'lightPhase', lightPhase,'lightRowID', lightRowID,'nodeID', nodeID,'state', state)) from Light));
	select temp;
end $$
DELIMITER ;

drop procedure if exists updateAll;
DELIMITER $$
create procedure updateAll(in p_data varchar(4000))
begin
if JSON_VALID(p_data) THEN
	-- Update Intersections --
	insert into Intersection
		select * FROM
			JSON_TABLE(
				p_data,
				"$.intersections[*]" COLUMNS(
					intersectionID VARCHAR(36) path "$.intersectionID",
					latitude decimal(3,3) path "$.latitude",
					longitude decimal(3,3) path "$.longitude"
					)
			) as it
		ON DUPLICATE KEY UPDATE latitude = it.latitude, longitude = it.longitude;

	-- Update Node --
	insert into Node
		select * FROM
			JSON_TABLE(
				p_data,
				"$.nodes[*]" COLUMNS(
					nodeID varchar(36) path "$.nodeID",
					nodeDescription varchar(100)  path "$.nodeDescription",
					intersectionID varchar(36) path "$.intersectionID",
					ipAddress varchar(20) path "$.ipAddress",
					isAlive binary(1) path "$.isAlive"
					)
			) as nt
		ON DUPLICATE KEY UPDATE nodeDescription = nt.nodeDescription, intersectionID = nt.intersectionID,
								ipAddress = nt.ipAddress, isAlive = nt.isAlive;
	-- Update Light
	insert into Light
		select * FROM
			JSON_TABLE(
				p_data,
				"$.lights[*]" COLUMNS(
					lightID varchar(36) path "$.lightID",
					nodeID varchar(36) path "$.nodeID",
					lightPhase int path "$.lightPhase",
					lightRowID int path "$.lightRowID",
					state varchar(100) path "$.state"
					)
			) as lt
		ON DUPLICATE KEY UPDATE lightID = lt.lightID, nodeID = lt.nodeID, lightPhase = lt.lightPhase,
								lightRowID = lt.lightRowID, lightRowID = lt.lightRowID, state = lt.state;
else
	select 'BAD JSON' x;
END IF;
end $$
