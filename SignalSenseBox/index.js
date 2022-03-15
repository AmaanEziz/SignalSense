const express = require("express");
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const openApiDocumentation = require('./api/api-doc');
const cors = require('cors');

const udp = require('dgram');
const sock = udp.createSocket('udp4');



dotenv.config();

const pool = require('./dbconfig');

const app = express();
app.use(cors());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocumentation));
app.use(express.json());

const port = process.env.SERVER_PORT || 3000;

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

// Endpoint to verify server is up
app.get("/", async (req, res) => {
  res.json({ status: "lets to it 🍍😎" });
});

//End point for node actions
const Node = require('./models/NodeModel');
const { json } = require("express/lib/response");
const nodeRouter = require('./routes/nodeRouter')(Node);
app.use('/api/node', nodeRouter);

//endpoint for fileRouter
const fileRouter = require('./routes/fileRouter')();
app.use('/api/nodeImages/', fileRouter);
app.use('/api/node', nodeRouter);



sock.on('message',function(msg,info){
  console.log('Data received from server : ' + msg.toString());
  console.log('Received %d bytes from %s:%d\n',msg.length,    info.address, info.port);
});


const pool2 = require('./dbconfig');
// Send a signal every 90 milliseconds
setInterval(()=>{
  // if this is ran on a Signal sense box, there should only exist
  // one intersection ID 
  const intersection_id = 'select intersectionID from Intersection';
  pool.query(intersection_id, null, (error, result) =>{
    // check if query was sucessful 
    if(error){
      console.log(error);
    }
    else{
      // Query the NTCIP stream for a given intersection
      const ntcip_query = 'call get_phase_stream(?)';
      console.log(result);
      pool2.query(ntcip_query, result[0].intersectionID, (error, results) =>{
        //check if query was successful
        if(error) {
          console.log(error);
        }
        else {
          // Send NTCIP stream to our hypothetical "RSU"
          sock.send(JSON.stringify(results), 2453, '10.0.15.255', function(error){            
            if(error){
              console.log(error);
            }
            else {
              console.log('NTCIP stream has been sent.');
            }
          });
        }
      });
    }
  });
}, 100);