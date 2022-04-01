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