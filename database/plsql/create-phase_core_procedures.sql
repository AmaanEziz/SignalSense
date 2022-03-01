DELIMITER $$
/*
	Adds nodes to the node table
*/
create procedure add_node(IN in_location VARCHAR(100), IN in_ipaddress varchar(15), IN in_isalive boolean)
begin
	insert into node(location, ipaddress, isalive) values(in_location, in_ipaddress, in_isalive);
    select * from node where id = last_insert_id();
END$$

/*
	Updates a node, pass null to location, ipaddress or isalive to keep the original value
*/
create procedure patch_node(IN in_node_id int, IN in_location VARCHAR(100), IN in_ipaddress varchar(15), IN in_isalive boolean)
begin
	if in_location is not null then
		update node set location = in_location where id = in_node_id;
	end if;
	if in_ipaddress is not null then
		update node set ipaddress = in_ipaddress where id = in_node_id;
	end if;
	if in_isalive is not null then
		update node set isalive = in_isalive where id = in_node_id;
	end if;
    select * from node where id = in_node_id;
END$$

/*
	Removes the node and it's children lights
*/
create procedure remove_node(IN in_node_id int)
begin
	delete from light where node_id = in_node_id;
    delete from node where id = in_node_id;
END$$

 /*
	This will update or insert a light.
    To update a light pass in_id, to insert pass null to in_id
*/

create procedure update_light(IN in_id int, IN in_node_id int, IN in_light_phase int, IN in_state varchar(100))
begin
	declare temp_id int;
	IF in_id is null then
		insert into light(node_id, light_phase, state) values ( in_node_id, in_light_phase, in_state);
        -- can also do a Trigger before insert but this makes it so only update_light does it.
        set temp_id = last_insert_id();
        WITH light_update AS (
			select id, ROW_NUMBER() OVER (PARTITION BY node_id) as new_row_num
			FROM light
			WHERE node_id = IN_NODE_ID
		)update light set light_id = (select light_update.new_row_num from light_update where light.id = light_update.id) WHERE node_id = IN_NODE_ID AND light.id = temp_id;
	else
		update light set
			light_phase = in_light_phase,
            state = in_state
		WHERE
			node_id = in_node_id
			and id = in_id;
	END IF;
    select * from light where id = temp_id;
END$$

create procedure patch_light(IN in_id int, IN in_light_phase int, IN in_state varchar(100))
begin
	if in_light_phase is not null then
		update light set light_phase = in_light_phase where id = in_id;
	end if;
	if in_state is not null then
		update light set state = in_state where id = in_id;
	end if;
    select * from light where id = in_id;
END$$

 /*
	This will update a nodes phase status. eg. phase 3 is RED.
*/
create procedure update_phase_status(IN in_node_id int, IN in_phase int, IN in_status varchar(100))
begin
	update light set status = in_status where node_id = in_node_id and light_phase = in_phase;
end$$

create procedure get_node_state_id(IN in_node_id int, OUT out_ret varchar(64))
begin
	declare ret varchar(64);
    declare temp varchar(4);
    declare done int default false;
    declare c_binchunks cursor for
		select lpad(bin(lf.id), 4, '0') as nibble
        from light as l, light_state_ref as lf
        where
			l.state = lf.state
            and l.node_id = in_node_id
		order by l.light_id;
    declare continue handler for not found set done = true;
    open c_binchunks;

    set ret = "";

    getString: LOOP
		FETCH c_binchunks INTO temp;
        IF done = true then
			leave getString;
        END IF;
        set ret = concat(ret, temp);
	END LOOP getString;

    close c_binchunks;
    set out_ret = ret;
    select in_node_id node_id,  ret;
END$$

create procedure has_image(IN IN_NODE_ID int)
begin
	declare temp_state_id varchar(64);
	call get_node_state_id(in_node_id, temp_state_id);
    select exists (select image_key from node_image where node_id = IN_NODE_ID and image_key = temp_state_id) as reg, temp_state_id as node_state; -- registered
end$$

create procedure update_node_image(in in_node_id int)
begin
	declare temp_state_id varchar(64);
    call get_node_state_id(in_node_id, temp_state_id);
    INSERT INTO node_image(image_key, node_id) VALUES (temp_state_id, in_node_id);
end$$

create procedure GET_IMAGE_URL(in in_node_id int)
begin
	declare temp_state_id varchar(64);
	call get_node_state_id(in_node_id, temp_state_id);
	select CONCAT(in_node_id, '_', temp_state_id, '.png') as fileName;
end$$

DELIMITER ;
