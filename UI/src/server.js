const express = require("express");
const cors = require('cors');




const app = express();
app.use(cors());
app.use(express.json());
app.set('view engine', 'ejs');
const port = process.env.PORT || 3000 ;
app.use("/css", express.static(__dirname + "/css"));
app.use("/js", express.static(__dirname + "/js"));

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
