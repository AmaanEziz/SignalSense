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
            return res.status(200).send('"status": "OK"');
          }
        });
    }
    return { updateAll };
  }
  
  module.exports = intersectionController;