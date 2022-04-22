const pool = require('../dbconfig');
function intersectionController() {
    function updateAll(req, res) {
        const query = "CALL updateAll(?)";
        pool.query(query, [JSON.stringify(req.body)], (error, results) => {
          if (error) {
            console.log(error);
            return res.status(501).send('DB is down');
          }
          else {
            console.log(results);
            return res.status(200).send('"status": "OK"');
          }
        });
    }
    function getStream(req, res){
      const query = "CALL get_phase_stream(?)";
      pool.query(query, [req.query.intersectionID], (error, results) => {
        if (error) {
          console.log(error);
          return res.status(501).send('Unable to generate the stream.\nContact Support');
        }
        else {
          console.log(results);
          res.set('Content-Type', 'application/json');
          return res.status(200).json(results[0]);
        }
      });
    }
    return { updateAll, getStream };
  }
  
  module.exports = intersectionController;
