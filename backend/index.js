const express = require("express");
const mysql = require("mysql2");
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const openApiDocumentation = require('./api/api-doc');
const cors = require('cors');


dotenv.config();
const app = express();
app.use(cors());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocumentation));

app.use(express.json());

const port = process.env.SERVER_PORT || 3000;

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASS,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQL_PORT
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

// Endpoint to verify server is up
app.get("/", async (req, res) => {
  res.json({ status: "lets to it 🍍😎" });
});


//Endpoint to add node
app.post("/node", async (req, res) => {
  if (req.query.location == null) {
    res.status(401).send('Missing query pram location');
  } else {
    console.log('wow');
    const query = "CALL add_node(?)";
    pool.query(query, [req.query.location], (error, results) => {
      if (error) {
        res.status(501).send('DB is down');
        console.log(error);
      }
      else {
        res.status(200).send('Added new node');
      }
    });
  }
});

//Endpoint to del node
app.delete("/node", async (req, res) => {
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
});

app.get("/nodes", async (req, res) => {
  const query = "SELECT * FROM node";
  pool.query(query, null, (error, results) => {
    if (error) {
      res.json({ status: "DB is down. 😶" + error.code });
      console.log(error);
    }
    else if (!results[0]) {
      res.json({ status: "Not Found 😶" });
    } else {
      res.json(results);
    }
  });
});


app.post("/updateLight", async (req, res) => {
  const { light_id, node_id, state, light_phase } = req.body;
  if (false) {
    //TODO add some sorta error handeling...
    //res.status(401).send('Missing query pram location');
  } else {
    console.log('wow');
    const query = "CALL update_light(?,?,?,?)";
    pool.query(query, [light_id, node_id, light_phase, state], (error, results) => {
      if (error) {
        res.status(501).send('DB is down');
        console.log(error);
      }
      else {
        res.status(200).send('Updated Light');
      }
    });

  }
});


app.get("/nodelights", async (req, res) => {
  if (req.query.nodeId == null) {
    res.status(401).send('Missing query pram nodeId');
  } else {
    const query = "select node_id, light_id, light_phase, state from light where node_id = ? order by 1,2";
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
});

const Node = require('./models/NodeModel');
const nodeRouter = require('./routes/nodeRouter')(Node);
app.use('/api/node', nodeRouter);

const fileRouter = require('./routes/fileRouter')();

app.use('/api/nodeImages/', fileRouter);