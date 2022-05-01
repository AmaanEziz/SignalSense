const express = require('express');
const NodeController = require('../controllers/nodeController');
const LightController = require('../controllers/lightController');
const FileController = require('../controllers/fileController');
function routes(Node) {

    const nodeRouter = express.Router();
    const nodeController = NodeController(Node);
    const lightController = LightController();

    nodeRouter.route('/getImage')
        .get(nodeController.fetchImage)

    nodeRouter.route('/list')
        .get(nodeController.getAll);
    nodeRouter.route('/')
        .get(nodeController.getOne);

    nodeRouter.route('/intersection')
        .get(nodeController.getIntersection);

    nodeRouter.route('/light')
        .get(lightController.getAll)
        .post(lightController.post)
        .patch(lightController.patch);

    nodeRouter.route('/setLights')
        .patch(lightController.patchLights);

    nodeRouter.route('/admin')
        .post(nodeController.post)
        .delete(nodeController.remove)
        .patch(nodeController.patch);

    nodeRouter.route('/uploadImage')
        .post(nodeController.uploadImage, FileController.upload);

    return nodeRouter;
}


module.exports = routes;