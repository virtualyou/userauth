"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authJwt_1 = __importDefault(require("./authJwt"));
const verifySignUp_1 = __importDefault(require("./verifySignUp"));
module.exports = {
    authJwt: authJwt_1.default,
    verifySignUp: verifySignUp_1.default
};
//# sourceMappingURL=index.js.map