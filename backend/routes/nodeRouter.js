const express = require('express');
const NodeController = require('../controllers/nodeController');
const LightController = require('../controllers/lightController');
function routes(Node){

    const nodeRouter = express.Router();
    const nodeController = NodeController(Node);
    const lightController = LightController();


    nodeRouter.route('/list')
        .get(nodeController.getAll);
    nodeRouter.route('/')
        .get(nodeController.getOne);
    
    nodeRouter.route('/light')
        .get(lightController.getAll)
        .post(lightController.post)
        .patch(lightController.patch);
    
    nodeRouter.route('/setLights')
        .patch(lightController.patchLights)

    nodeRouter.route('/admin')
        .post(nodeController.post)
        .delete(nodeController.remove)
        .patch(nodeController.patch)

    return nodeRouter;
}


module.exports = routes;