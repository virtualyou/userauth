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
