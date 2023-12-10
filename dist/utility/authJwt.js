"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_config_1 = __importDefault(require("../config/auth.config"));
const models_1 = __importDefault(require("../models"));
const logger_1 = __importDefault(require("../middleware/logger"));
const User = models_1.default.user;
const verifyToken = (req, res, next) => {
    logger_1.default.log('info', 'Request: ' + req);
    logger_1.default.log('info', 'Token: ' + req.session.token);
    let token = req.session.token;
    if (!token) {
        return res.status(403).send({
            message: "No token provided!",
        });
    }
    jsonwebtoken_1.default.verify(token, auth_config_1.default.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: "Unauthorized!",
            });
        }
        req.userId = decoded.id;
        req.ownerId = decoded.owner;
        next();
    });
};
const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.userId);
        const roles = await user.getRoles();
        for (let i = 0; i < roles.length; i++) {
            if (roles[i].name === "admin") {
                return next();
            }
        }
        return res.status(403).send({
            message: "Require Admin Role!",
        });
    }
    catch (error) {
        return res.status(500).send({
            message: "Unable to validate User role!",
        });
    }
};
const isOwner = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.userId);
        const roles = await user.getRoles();
        for (let i = 0; i < roles.length; i++) {
            if (roles[i].name === "owner") {
                return next();
            }
        }
        return res.status(403).send({
            message: "Require Owner Role!",
        });
    }
    catch (error) {
        return res.status(500).send({
            message: "Unable to validate Owner role!",
        });
    }
};
const isAgent = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.userId);
        const roles = await user.getRoles();
        for (let i = 0; i < roles.length; i++) {
            if (roles[i].name === "agent") {
                return next();
            }
        }
        return res.status(403).send({
            message: "Require Agent Role!",
        });
    }
    catch (error) {
        return res.status(500).send({
            message: "Unable to validate Agent role!",
        });
    }
};
const isMonitor = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.userId);
        const roles = await user.getRoles();
        for (let i = 0; i < roles.length; i++) {
            if (roles[i].name === "monitor") {
                return next();
            }
        }
        return res.status(403).send({
            message: "Require Monitor Role!",
        });
    }
    catch (error) {
        return res.status(500).send({
            message: "Unable to validate Monitor role!",
        });
    }
};
const authJwt = {
    verifyToken,
    isAdmin,
    isOwner,
    isAgent,
    isMonitor
};
exports.default = authJwt;
//# sourceMappingURL=authJwt.js.map