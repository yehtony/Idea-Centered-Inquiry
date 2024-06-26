const db = require('../models');

// Assigning levels to the variable Group
// const Node = db.Node;
// const GroupNode = db.GroupNode;
const Group = db.Group;
// const Op = db.Sequelize.Op;
const ChatRoomMessage = db.ChatRoomMessage;

// Create and Save new Node.
exports.create = async (req, res) => {
  const { groupId, author, content } = req.body;
  try {
    const node = await ChatRoomMessage.create({
      content: content,
      author: author,
      groupId: groupId,
    });
    // await GroupNode.create({
    //   GroupId: groupId,
    //   NodeId: node.id,
    // });

    console.log('Created message:', ChatRoomMessage);
    res.status(200).send({
      message: 'Message created successfully',
      node: node,
    });
  } catch (err) {
    console.log('Error while creating message:', err);
    res.status(500).send({
      message: 'Error while creating message',
      error: err.message,
    });
  }
};

// Find all nodes by groupId.
exports.findAllNode = (req, res) => {
  const groupId = req.params.groupId;

  Group.findAll({
    where: {
      id: groupId,
    },
    include: [
      {
        model: ChatRoomMessage,
        through: { attributes: [] },
      },
    ],
  })
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find group with id=${groupId}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Error retrieving group with id=' + groupId,
      });
    });
};

// // Find a single node with an id.
// exports.findOneNode = (req, res) => {
//   const id = req.params.id;

//   Node.findByPk(id)
//     .then((data) => {
//       if (data) {
//         res.send(data);
//       } else {
//         res.status(404).send({
//           message: `Cannot find node with id=${id}.`,
//         });
//       }
//     })
//     .catch((err) => {
//       res.status(500).send({
//         message: err.message || 'Error retrieving node with id=' + id,
//       });
//     });
// };

// exports.updateNode = (req, res) => {
//   const nodeId = req.params.nodeId;

//   Node.update(req.body, {
//     where: { id: nodeId },
//   })
//     .then((num) => {
//       if (num == 1) {
//         res.status(200).send({
//           message: 'Node was updated successfully.',
//         });
//       } else {
//         res.send({
//           message: `Cannot update Node with id=${nodeId}. Maybe Node was not found or req.body is empty!`,
//         });
//       }
//     })
//     .catch((err) => {
//       res.status(500).send({
//         message: err || 'Error updating Node with id=' + nodeId,
//       });
//     });
// };
