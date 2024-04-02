module.exports = (sequelize, DataTypes) => {
  const ChatRoomMessage = sequelize.define('ChatRoomMessage', {
    groupId: DataTypes.INTEGER,
    author: DataTypes.STRING,
    content: DataTypes.TEXT,
  });
  return ChatRoomMessage;
};
