
const pool = require('../dbconfig');
function nodeController() {
  function getAll(req, res) {
    if (req.query.nodeId == null) {
      return res.status(401).send('Missing query pram nodeId');
    }
    const query = "select * from Light where nodeID = ? order by lightRowID";
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
  function post(req, res) {
    const { node_id, light_phase, state } = req.body;
    console.log(req.body);
    if (false) {
      //TODO add some sorta error handeling...
      //res.status(401).send('Missing query pram location');
    } else {
      const query = "CALL add_light(?,?,?)";
      pool.query(query, [node_id, light_phase, state], (error, results) => {
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
  // function put(req, res) {
  //   const { light_id, node_id, light_phase, state } = req.body;
  //   console.log(req.body);
  //   if (false) {
  //     //TODO add some sorta error handeling...
  //     //res.status(401).send('Missing query pram location');
  //   } else {
  //     const query = "CALL update_light(?,?,?,?)";
  //     pool.query(query, [light_id, node_id, light_phase, state], (error, results) => {
  //       if (error) {
  //         console.log(error);
  //         return res.status(501).send('DB is down');
  //       }
  //       else {
  //         return res.status(200).json(results[0]);
  //       }
  //     });
  //   }
  // };
  function patch(req, res) {
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
  function patchLights(req, res) {
    const { lights } = req.body; 
    for (i = 0; i < lights.length; i++) {
      var { lightID, lightPhase, state } = lights[i];
      const query = "CALL patch_light(?,?,?)";
      pool.query(query, [lightID, lightPhase, state], (error, results) => {
        if (error) {
          console.log(error);
          return res.status(501).send('DB is down');
        }
        // var { nodeID } = results[0][0];
        // const query2 = "CALL get_image(?)";
        // pool.query(query2, [nodeID], (error, results2) => {
        //   return res.status(200).json(results2[0]);
        // });
      });
    }
    return res.status(200).send('Success');
  };
  return { getAll, post, patch, patchLights };


}

module.exports = nodeController;

