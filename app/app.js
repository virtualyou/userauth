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

const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
const init = process.argv.includes('--init=true');

const app = express();

app.use(cors());

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(
    cookieSession({
        name: "virtualyou-session",
        keys: ["COOKIE_SECRET"],
        httpOnly: true,
        sameSite: 'strict'
    })
);

// httpOnly: true

// database
const db = require("./models");
const Role = db.role;

if (init) {
    db.sequelize.sync({force: true}).then(() => {
        console.log('Drop and Resync Db');
        initial();
    });
} else {
    db.sequelize.sync();
}

// simple route
app.get("/", (req, res) => {
    res.json({ message: "Welcome to the VirtualYou UserAuth API." });
});

// routes
require("./routes/auth.routes")(app);
require("./routes/user.routes")(app);

// create reference role objects
function initial() {
    Role.create({
        id: 1,
        name: "owner",
    });

    Role.create({
        id: 2,
        name: "agent",
    });

    Role.create({
        id: 3,
        name: "monitor",
    });

    Role.create({
        id: 4,
        name: "admin",
    });
}

module.exports = app;