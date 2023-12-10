
/*
 *
 * VirtualYou Project
 * Copyright 2023 David L Whitehurst
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

//const config = require("../config/db.config.js");
import config from '../config/config';
import { Sequelize } from 'sequelize';
import Role from './role.model';
import User from './user.model';

const sequelize = new Sequelize(
    config.database.db,
    config.database.user,
    config.database.password,
    {
        host: config.database.host,
        dialect: config.database.dialect,
        pool: {
            max: config.database.pool.max,
            min: config.database.pool.min,
            acquire: config.database.pool.acquire,
            idle: config.database.pool.idle
        }
    }
);

let db: any;
db = {};

db['sequelize'] = sequelize
db['Sequelize'] = Sequelize

db.role = Role (sequelize, Sequelize);
db.user = User (sequelize, Sequelize);

//db.user = require("../models/user.model.js")(sequelize, Sequelize);
//db.role = require("../models/role.model.js")(sequelize, Sequelize);

db.role.belongsToMany(db.user, {
  through: "user_roles"
});
db.user.belongsToMany(db.role, {
  through: "user_roles"
});

db.ROLES = ["owner", "agent", "monitor", "admin"];

export default db;
