import "./createRequire.js";
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
import cookieParser from 'cookie-parser';
const __dirname = path.dirname(__filename);
const express = require("express");
const cors = require('cors');
import fetch from 'node-fetch';


const app = express();
app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.set('view engine', 'ejs');
const port = process.env.PORT || 3000 ;
app.use("/css", express.static(__dirname + "/css"));
app.use("/js", express.static(__dirname + "/js"));
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    if ('OPTIONS' == req.method) {
        res.sendStatus(200);
    }
    else {
        next();
    }
});

app.listen(port, () => {
    console.log(`App running on port ${port}`);
});

// Endpoint to verify server is up
app.get("/", async (req, res) => {

    res.render('index.ejs');
});


app.get("/device.html", async (req, res) => {
    res.render('device.ejs');
});
