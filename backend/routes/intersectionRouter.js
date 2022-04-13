const express = require("express");
const router = express.Router();
const controller = require("../controllers/intersectionController")();
function routes(temp){
    router.put("/updateAll", controller.updateAll);
    return router
}
module.exports = routes;