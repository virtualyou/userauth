"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const authJwt_1 = __importDefault(require("../utility/authJwt"));
const userRouter = (0, express_1.default)();
userRouter.use((_req, res, next) => {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
});
userRouter.get("/userauth/v1/all", user_controller_1.default.allAccess);
userRouter.get("/userauth/v1/owner", [authJwt_1.default.verifyToken, authJwt_1.default.isOwner], user_controller_1.default.ownerBoard);
userRouter.get("/userauth/v1/agent", [authJwt_1.default.verifyToken, authJwt_1.default.isAgent], user_controller_1.default.agentBoard);
userRouter.get("/userauth/v1/monitor", [authJwt_1.default.verifyToken, authJwt_1.default.isMonitor], user_controller_1.default.monitorBoard);
userRouter.get("/userauth/v1/admin", [authJwt_1.default.verifyToken, authJwt_1.default.isAdmin], user_controller_1.default.adminBoard);
userRouter.get("/userauth/v1/users", [authJwt_1.default.verifyToken], user_controller_1.default.getAllUsers);
userRouter.get("/userauth/v1/users/:id", [authJwt_1.default.verifyToken], user_controller_1.default.getUserById);
userRouter.get("/userauth/v1/users/:id/roles", [authJwt_1.default.verifyToken], user_controller_1.default.getUserRoles);
exports.default = userRouter;
//# sourceMappingURL=user.routes.js.map