"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../config/config"));
const sequelize_1 = require("sequelize");
const role_model_1 = __importDefault(require("./role.model"));
const user_model_1 = __importDefault(require("./user.model"));
const sequelize = new sequelize_1.Sequelize(config_1.default.database.db, config_1.default.database.user, config_1.default.database.password, {
    host: config_1.default.database.host,
    dialect: config_1.default.database.dialect,
    pool: {
        max: config_1.default.database.pool.max,
        min: config_1.default.database.pool.min,
        acquire: config_1.default.database.pool.acquire,
        idle: config_1.default.database.pool.idle
    }
});
let db;
db = {};
db['sequelize'] = sequelize;
db['Sequelize'] = sequelize_1.Sequelize;
db.role = (0, role_model_1.default)(sequelize, sequelize_1.Sequelize);
db.user = (0, user_model_1.default)(sequelize, sequelize_1.Sequelize);
db.role.belongsToMany(db.user, {
    through: "user_roles"
});
db.user.belongsToMany(db.role, {
    through: "user_roles"
});
db.ROLES = ["owner", "agent", "monitor", "admin"];
exports.default = db;
//# sourceMappingURL=index.js.map