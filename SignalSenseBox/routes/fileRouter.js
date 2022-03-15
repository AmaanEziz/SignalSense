const express = require("express");
const router = express.Router();
const controller = require("../controllers/fileController");
function routes(temp) {
    router.post("/upload", controller.upload);
    router.get("/files", controller.getListFiles);
    router.get("/files/:name", controller.download);

    return router;

}
module.exports = routes;