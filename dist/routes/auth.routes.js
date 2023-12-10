"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const verifySignUp_1 = __importDefault(require("../utility/verifySignUp"));
const authRouter = (0, express_1.default)();
authRouter.use((_req, res, next) => {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
});
authRouter.post("/userauth/v1/auth/signup", [
    verifySignUp_1.default.checkDuplicateUsernameOrEmail,
    verifySignUp_1.default.checkRolesExisted
], auth_controller_1.default.signup);
authRouter.post("/userauth/v1/auth/signin", auth_controller_1.default.signin);
authRouter.post("/userauth/v1/auth/signout", auth_controller_1.default.signout);
exports.default = authRouter;
//# sourceMappingURL=auth.routes.js.map