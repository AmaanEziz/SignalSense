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
      var { intersectionID } = req.body;
      const query = "CALL get_phase_stream(?)";
      pool.query(query, [intersectionID], (error, results) => {
        if (error) {
          console.log(error);
          return res.status(501).send('Unable to generate the stream.\nContact Support');
        }
        else {
          console.log(results);
          return res.status(200).JSON(results);
        }
      });
    }
    return { updateAll, getStream };
  }
  
  module.exports = intersectionController;
