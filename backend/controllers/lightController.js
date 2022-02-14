
const pool = require('../dbconfig');
function nodeController(){
    function getAll(req,res){
        if (req.query.nodeId == null) {
            return res.status(401).send('Missing query pram nodeId');
          } 
        const query = "select id, light_id, state, light_phase from light where node_id = ? order by 2";
        pool.query(query, [req.query.nodeId], (error, results) => {
          if (error) {
            console.log(error);
            return res.status(500).json({ status: "DB is down. 😶" + error.code });
            
          }
          else if (!results[0]) {
            return res.json({ status: "node_id not registered" });
          } else {
            return res.json(results);
          }
        });
    }
    function post(req,res){
        const { light_id, node_id, light_phase, state } = req.body;
        console.log(req.body);
        if (false) {
          //TODO add some sorta error handeling...
          //res.status(401).send('Missing query pram location');
        } else {
          const query = "CALL update_light(?,?,?,?)";
          pool.query(query, [light_id, node_id, light_phase, state], (error, results) => {
            if (error) {
                console.log(error);
                return res.status(501).send('DB is down');
            }
            else {
              return res.status(200).json(results[0]);
            }
          });
        }
    };
    function put(req,res){
        const { light_id, node_id, light_phase, state } = req.body;
        console.log(req.body);
        if (false) {
          //TODO add some sorta error handeling...
          //res.status(401).send('Missing query pram location');
        } else {
          const query = "CALL update_light(?,?,?,?)";
          pool.query(query, [light_id, node_id, light_phase, state], (error, results) => {
            if (error) {
                console.log(error);
                return res.status(501).send('DB is down');
            }
            else {
              return res.status(200).json(results[0]);
            }
          });
        }
    };
    function patch(req,res){
        const { id, state, light_phase } = req.body;
        console.log(req.body);
        if (false) {
          //TODO add some sorta error handeling...
          //res.status(401).send('Missing query pram location');
        } else {
          const query = "CALL patch_light(?,?,?)";
          pool.query(query, [id, light_phase, state], (error, results) => {
            if (error) {
                console.log(error);
                return res.status(501).send('DB is down');
            }
            else {
              return res.status(200).json(results[0]);
            }
          });
        }
    };
    function patchLights(req,res){
      const { lights } = req.body;
      console.log(req.body);
      for(i = 0; i < lights.length; i++){
          console.log(lights[i]);
          var { id, light_phase, state } = lights[i];
          const query = "CALL patch_light(?,?,?)";
          pool.query(query, [id, light_phase, state], (error, results) => {
            if (error) {
                console.log(error);
                return res.status(501).send('DB is down');
            }
          });     
      }

      const query2 = "CALL has_image(?)";
      pool.query(query2, [req.query.node_id], (error, results) =>{
        console.log(results[1]);
        if(results[1][0].reg == 1){
          return res.status(200).json({ status: "REGISTERED", node_image:  node_image});
        }else {
          var node_image = req.query.node_id + '_' + results[1][0].node_state;
          console.log(results[1][0].reg);
          return res.status(200).json({ status: "NOT_REGISTERED", node_image:  node_image});
        }
      });


      
    };

    return { getAll, post, put, patch, patchLights };


}

module.exports = nodeController;