const express = require("express");
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

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

// Endpoint to verify server is up
app.get("/", async (req, res) => {
  res.json({ status: "lets to it 🍍😎" });
});

//End point for node actions
const Node = require('./models/NodeModel');
const nodeRouter = require('./routes/nodeRouter')(Node);
app.use('/api/node', nodeRouter);

//endpoint for fileRouter
const fileRouter = require('./routes/fileRouter')();
app.use('/api/nodeImages/', fileRouter);