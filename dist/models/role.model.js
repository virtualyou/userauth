"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Role = (sequelize, Sequelize) => {
  return sequelize.define("roles", {
    name: {
      type: Sequelize.STRING,
    },
  });
};
exports.default = Role;
//# sourceMappingURL=role.model.js.map
