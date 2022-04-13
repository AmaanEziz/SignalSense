create view Phase_vw as (
    select 
        Phase.intersectionID, Phase.phaseRowId , coalesce(lt.state, 'UNDEFINED') state
    from 
        Phase
        left outer join Light lt on Phase.phaseRowId = lt.lightPhase and exists (select * from Node, Light where Node.nodeID = Light.nodeID and Light.lightID = lt.lightID)
    where 1=1
     GROUP BY phaseRowId, intersectionID, state
     order by intersectionID, phaseRowId
);

drop function if exists get_image_state;
DELIMITER $$
create function get_image_state(p_nodeID varchar(36))
returns varchar(100)
/*NOT DETERMINISTIC*/
begin
	return (select concat(p_nodeID,'_', group_concat(state, lightPhase order by lightRowID desc SEPARATOR '')) from Light where nodeID = p_nodeID);
end$$
DELIMITER ;