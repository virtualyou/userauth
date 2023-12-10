"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const User = (sequelize, Sequelize) => {
    return sequelize.define("users", {
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
};
exports.default = User;
//# sourceMappingURL=user.model.js.map