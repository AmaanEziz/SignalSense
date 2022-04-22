const express = require("express");
const router = express.Router();
const controller = require("../controllers/intersectionController")();
function routes(temp){
    router.put("/updateAll", controller.updateAll);
    router.get("/stream", controller.getStream);
    return router
}
module.exports = routes;