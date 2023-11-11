const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");

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
//      domain: '.virtualyou.info', // comment if testing local, for sub-domains but maybe env satisfies
      httpOnly: true,
      sameSite: 'strict'
    })
);

// database
const db = require("./app/models");
const Role = db.role;
/*
db.sequelize.sync({force: true}).then(() => {
    console.log('Drop and Resync Db');
    initial();
  });
*/
db.sequelize.sync();

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the VirtualYou UserAuth API." });
});

// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 3004;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

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
