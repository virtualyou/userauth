module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    username: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING
    },
    password: {
      type: Sequelize.STRING
    },
    ownerId: {
      type: Sequelize.INTEGER
    },
    agentMnemonic: {
      type: Sequelize.STRING
    },
    monitorMnemonic: {
      type: Sequelize.STRING
    },
    agentId: {
      type: Sequelize.INTEGER
    },
    monitorId: {
      type: Sequelize.INTEGER
    },

  });

  return User;
};
