module.exports = app => {
    const bodyParser = require('body-parser');
    const chatRoomMessage = require("../controllers/chatRoomMessage.controller");
    
    var router = require("express").Router();

    // Create an node.
    router.post('/create', bodyParser.json(), chatRoomMessage.create);

    // Find all nodes in group.
    // router.get('/all/:groupId', chatRoomMessage.findAllMessage);

    // // Get one node.
    // router.get('/:id', nodes.findOneNode);

    // // Update one node.
    // router.put('/:nodeId', nodes.updateNode);

    app.use('/api/chatRoomMessages', router);
}