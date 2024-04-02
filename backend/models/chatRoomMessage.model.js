module.exports = (sequelize, DataTypes) => {
  const ChatRoomMessage = sequelize.define('ChatRoomMesage', {
    groupId: DataTypes.INTEGER,
    author: DataTypes.STRING,
    content: DataTypes.TEXT,
  });
  return ChatRoomMessage;
};
