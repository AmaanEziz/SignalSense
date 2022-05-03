
const pool = require('../dbconfig');

function nodeController(Node) {
  function getAll(req, res) {
    const query = "SELECT * FROM Node";
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
      const query = "select * from Node where nodeID = ?";
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
    const { location, intersectionID, ipaddress, isalive } = req.body;
    if (location == null) {
      return res.status(400).send('Missing location from json');
    } else if (ipaddress == null) {
      return res.status(400).send('Missing ipaddress from json');
    } else if (isalive == null) {
      return res.status(400).send('Missing isalive from json');
    } else {
      const query = "CALL add_node(?, ?, ?, ?)";
      pool.query(query, [location, intersectionID, ipaddress, isalive], (error, results) => {
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
    const { location, ipaddress, isalive } = req.body;
    if (req.query.nodeId == null) {
      return res.status(401).send('Missing query pram nodeId ');
    }
    const query = "CALL patch_node(?,?,?,?,?)";
    pool.query(query, [req.query.nodeId, location, null, ipaddress, isalive], (error, results) => {
      if (error) {
        console.log(error);
        return res.status(500).send('DB is down');
      }
      else {
        return res.status(201).json(results[0]);
      }
    });
  };

  function fetchImage(req, res) {
    if (req.query.nodeId == null) {
      return res.status(400).send('Missing query pram nodeId ');
    }
    const query = "CALL GET_IMAGE_URL(?)";
    pool.query(query, [req.query.nodeId], (error, results) => {
      if (error) {
        console.log(error);
        return res.redirect('/api/nodeImages/files/something_went_wrong.pineapple.png');
      }
      else if (results[1][0].fileName == null) {
        return res.redirect('/api/nodeImages/files/something_went_wrong.pineapple.png');
      } else {
        var path = '/api/nodeImages/files/' + results[1][0].fileName;
        return res.redirect(path);
      }
    });
  };

  function uploadImage(req, res, next) {
    if (req.query.nodeId == null) {
      return res.status(400).send('Missing query pram nodeId ');
    }
    const query = 'call update_node_image(?)';
    pool.query(query, [req.query.nodeId], (error, results) => {
      if (error) {
        console.log(error);
        return res.status(500).json(error);
      } else {
        console.log(results[1][0]);
        req.fileName = results[1][0].fileName;
        return next();
      }
    });
  }
  
  function getIntersection(req, res) {
    const query = 'select intersectionID from Intersection'
    pool.query(query, null, (error, results) => {
      if (error) {
        console.log(error);
        return res.status(500).json(error);
      } else {
        return res.status(200).json(results);
      }
    });
  }

  return { getAll, post, remove, patch, getOne, fetchImage, uploadImage, getIntersection };


}

module.exports = nodeController;
