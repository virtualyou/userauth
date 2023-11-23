
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

const { authJwt } = require("../utility");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/userauth/v1/all", controller.allAccess);

  app.get(
    "/userauth/v1/owner",
    [authJwt.verifyToken, authJwt.isOwner],
    controller.ownerBoard
  );

  app.get(
      "/userauth/v1/agent",
      [authJwt.verifyToken, authJwt.isAgent],
      controller.agentBoard
  );

  app.get(
      "/userauth/v1/monitor",
      [authJwt.verifyToken, authJwt.isMonitor],
      controller.monitorBoard
  );

  app.get(
    "/userauth/v1/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );

  // admin only
  app.get(
      "/userauth/v1/users",
      [authJwt.verifyToken], //, authJwt.isAdmin],
      controller.getAllUsers
  );

  app.get(
    "/userauth/v1/users/:id",
    [authJwt.verifyToken],
    controller.getUserById
  );

  app.get(
      "/userauth/v1/users/:id/roles",
      [authJwt.verifyToken],
      controller.getUserRoles
  );
};
