sendIntersectionData.js

const pool2 = require('./dbconfig');
//Send a signal in intervals
var query = 'call get_all_data()';             
setInterval(() => {
  console.log('INTERVAL STARTS HERE');                      //For testing
  pool2.query(query, null, (error, results) => {
    if (error) {
      console.log(error);
    }
    var data = { intersection: results[0][0], lights: results[1], nodes: results[2] };
    console.log(JSON.stringify(data))
    url = 'http://localhost:3000/api/intersection/updateAll'; //localhost
    tiny.patch({ url, data }, function __posted(err, result) {
      if (err) {
        console.log(err);
      }
      else {
        console.log('Patch is good'); 
        console.log(result);
        
        //Send the Request
        let xhr = new XMLHttpRequest();
        xhr.open("POST", url , true);
        xhr.setRequestHeader("APIKEY", Process.env.API_KEY);
        xhr.send();
      }
    })
  });
}, 5000); //every 5 seconds, for testing