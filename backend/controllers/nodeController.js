
const pool = require('../dbconfig');
function nodeController(Node) {
  function getAll(req, res) {
    const query = "SELECT * FROM node";
    pool.query(query, null, (error, results) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ status: "DB Error: " + error.code });

      }
      else if (!results[0]) {
        return res.json({ status: "No nodes registerd with server" });
      } else {
        return res.json(results);
      }
    });
  };
  //Not working yet
  function getOne(req, res) {
    if (req.query.nodeId == null) {
      res.status(401).send('Missing query pram nodeId ');
    } else {
      const query = "select * from node where id = ?";
      pool.query(query, [req.query.nodeId], (error, results) => {
        if (error) {
          res.status(501).send('DB is down');
          console.log(error);
        }
        else {
          res.status(200).json(results);
        }
      });
    }
  };
  function post(req, res) {
    const {location, ipaddress, isalive} = req.body;
    if (location == null) {
      return res.status(400).send('Missing location from json');
    } else if (ipaddress == null) {
      return res.status(400).send('Missing ipaddress from json');
    } else if (isalive == null) {
      return res.status(400).send('Missing isalive from json');
    } else {
      const query = "CALL add_node(?, ?, ?)";
      pool.query(query, [location, ipaddress, isalive], (error, results) => {
        if (error) {
          console.log(error);
          return res.json({ status: "node_id not found" });
        }
        else {
          res.status(201).json(results[0])
        }
      });
    }
  };
  function remove(req, res) {
    if (req.query.nodeId == null) {
      res.status(401).send('Missing query pram nodeId ');
    } else {
      const query = "CALL remove_node(?)";
      pool.query(query, [req.query.nodeId], (error, results) => {
        if (error) {
          res.status(501).send('DB is down');
          console.log(error);
        }
        else {
          res.status(200).send('Removed new node and its lights');
        }
      });
    }
  };
  function patch(req, res) {
    const {location, ipaddress, isalive} = req.body;
    if (req.query.nodeId == null) {
      return res.status(401).send('Missing query pram nodeId ');
    }
    const query = "CALL patch_node(?,?,?,?)";
    pool.query(query, [req.query.nodeId, location, ipaddress, isalive], (error, results) => {
      if (error) {
        console.log(error);
        return res.status(500).send('DB is down');
      }
      else {
        return res.status(201).json(results[0]);
      }
    });
  };

  return { getAll, post, remove, patch, getOne};


}

module.exports = nodeController;