/*
* Creates the core tables for Signal Sense 
*/

use signalDB;

create table node(
	id int auto_increment,
    location varchar(100) DEFAULT 'CONFIGURE NODE',
    ipaddress varchar(15),
    isalive boolean,
    primary key(id)
);

CREATE TABLE light_state_ref (
	id int,
	state varchar(100) not null unique,
    primary key(id)
);

create table light(
	id int auto_increment,
    node_id int,
    light_id int comment 'This id is only for display purpuse. The DB will create it. rowid partitioned by the node_id',
	light_phase int not null,
	state varchar(100),
    primary key(id),
    foreign key(state) references light_state_ref(state),
    foreign key(node_id) references node(id)
);



create table node_image(
	id int not null auto_increment,
    image_key varchar(64), -- 64 bit number. Each 4 positional bits is a light id, the value of these 4 bits is a state. all 0000 means no light. 
						    -- Example: 01100001 = Light id 1: RED, Light id 2: lEFT_GREEN
                            -- If the node_id is 135 then the image path will be the id of this table ./uploads/152.png
    node_id int,
    primary key(id),
    foreign key(node_id) references node(id)
);

