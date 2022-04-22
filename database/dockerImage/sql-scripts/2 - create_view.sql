create view Phase_vw as (
	select 
		Phase.intersectionID, Phase.phaseRowId, coalesce((if(lt.state = 0, null, lt.state)), 'UNDEFINED') state
	from  
		Phase
		inner join Node on Node.intersectionID = Phase.intersectionID
		left outer join Light lt on Phase.phaseRowId = lt.lightPhase and lt.nodeID = Node.nodeID -- and exists (select * from Node, Light where Node.nodeID = Light.nodeID and Light.lightID = lt.lightID)
	where 1=1
	 GROUP BY phaseRowId, intersectionID, state
	 order by Phase.intersectionID, phaseRowId
);